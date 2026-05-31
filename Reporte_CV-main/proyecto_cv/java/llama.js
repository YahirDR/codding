// ========================================================
// proyecto_cv/java/llama.js
// Lógica del Chatbot e Interfaz del Portafolio
// ========================================================

// Importamos la configuración privada desde el mismo directorio
import CONFIG from './config.js';
// Array para almacenar el historial de la conversacion (mensajes del usuario y respuestas de la IA)
let chatHistory = [];

// ===================== FUNCIÓN PREGUNTAR =====================
/**
 * Envía el mensaje del usuario a Groq y devuelve la respuesta de la IA
 */
async function preguntarLlama(prompt) {
    try {
        // 0. Guardamos el mensaje del usuario en el historial
        chatHistory.push({ role: "user", content: prompt });

        // 1. Hacer la petición HTTP a Groq usando el objeto CONFIG importado
        const response = await fetch(CONFIG.GROQ_URL, {
            method: "POST",
            headers: {
                // Usar el Header para que groq sepa que estamos autenticados con nuestra API Key
                "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`,
                // Indicamos que estamos enviando datos en formato JSON
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Seleccionar el modelo que usamos para nuestra Ia(el más potente disponible en Groq)
                model: "llama-3.3-70b-versatile",
                
                // Mensajes que se envían al modelo
                messages: [
                    {
                        // System prompt: Instrucciones permanentes para definir la personalidad
                        role: "system",
                        content: `Eres un asistente profesional, amigable y entusiasta. Tu trabajo es ayudar como ia en el portafolio virtual 
                                  de Juan Yahir Durán Ruíz. Debes ser una ia enfocada a similar a una secretaria encargada de ayudar a los visitantes del portafolio web, 
                                  por ello debes de siempre enfocarte en responder dudas acerda de juan Yahir duran ruíz.
                                  Debes recordar que es egresado de Ingeniería en Sistemas Computacionales del ITSUR (Instituto Tecnológico Superior del Sur de Guanajuato).
                                  Su experiencia laboral es la siguiente:
                                  - Desarrollador Web e Integración de IA en Byoko, Moroleón, Guanajuato: Desarrollo de páginas web con HTML, CSS, JavaScript y conexión a bases de datos MySQL; Implementación de APIs de inteligencia artificial con Ollama y Llama 3.3 70B en Hostinger; Integración de APIs de Groq para habilitar funciones de IA en servidores web; Instalación y configuración nativa de modelos de IA en PCs para ejecución local; Creación de la página web Turismo Moroleón.
                                  - Desarrollador Full-Stack en Instituto Tecnológico Superior del Sur de Guanajuato, Uriangato, Guanajuato: Implementación de sistema web con arquitectura de tres capas (WEB, MODEL y DATA) desarrollado en ASP.NET; Desarrollo de servicios ASMX, modelos POCO y DAOs con ADO.NET para gestión de alumnos externos y docentes; Validaciones robustas, eliminación controlada, control de estados, tarjetas de identificación y reportes PDF dinámicos usando ASP.NET Web Forms, ASMX Services, C#, ADO.NET, SQL Server, JavaScript, jQuery, Bootstrap, DataTables y pdfMake.
                                  - Soporte Técnico en Telesecundaria 915, Aguascalientes, Uriangato, Guanajuato: Resolución de fallas de software y configuración de herramientas digitales para docentes; Soporte preventivo y correctivo a laptops, equipos de escritorio e impresoras; Actualizaciones y parches de seguridad para mejorar el rendimiento de los equipos; Diagnóstico, restauración y reparación de equipos con fallas técnicas.
                                  Además de que curse y acreditó 10 el nivel  de ingles en el centro de idiomas (Centro de Lenguas Extranjeras) del ITSUR. Equivalente a un nivel B1 robusto o un B2 (capacidad de mantener conversaciones técnicas, escribir documentación y entender código)
                                  Las tecnologias y/o softwares que domina son: Java, Python, C#, JavaScript, HTML, CSS, SQL, Github, react y react native (Si es necesario busca información sobre los softwares anteriores y en resumen informa su uso e importancia.). 
                                  Responde siempre en español y en caso de que saa necesario en ingles, de forma clara, positiva y profesional.
                                  Ademas de contar con experiencia en reparacion de computadoras, desarrollo de software y desarrollo web.
                                  En caso de que me quieran contactar mi correo es nopipo22@gmail.com y mi numero de telefono es 4454567886.
                                  No respondas nada que no tenga que ver con juan yahir duran ruiz, y si no sabes algo, se honesto y di que no lo sabes, pero nunca inventes información.`
                        },
                    ...chatHistory           // Incluimos todo el historial para mantener contexto
                ],
                
                temperature: 0.7,    // Nivel de creatividad (0.0 = preciso, 1.0 = muy creativo)
                max_tokens: 700,      // Máximo de tokens que puede generar en la respuesta
                stream: false        // false para recibir la respuesta comple
            })
        });

        // verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // transformar la respuesta a formato JSON
        const data = await response.json();
        
        // Extraemos el texto de la respuesta (estructura específica de Groq/OpenAI)
        const respuesta = data.choices[0].message.content;

        // añadimos con un push la respuesta de la IA en el historial
        chatHistory.push({ role: "assistant", content: respuesta });

        return respuesta;
      // En caso de error, lo mostramos en consola y devolvemos un mensaje de error
    } catch (error) {
        console.error("Error conectando con Groq:", error);
        return "❌ Hubo un error al conectar con la IA.\n\nPor favor intenta de nuevo en unos momentos.";
    }
}

// ===================== FUNCIONES DE LA INTERFAZ =====================

/**
 * Funcion para agregar un mensaje al contenedor visual del chat
 */
function agregarMensaje(texto, esUsuario) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = esUsuario ? 'user-message' : 'llama-message';
    mensajeDiv.textContent = texto;
    
    messagesContainer.appendChild(mensajeDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll hacia abajo
}

/**
 * Función que se ejecuta cuando el usuario envía un mensaje
 */
async function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();

    if (!mensaje) return;

    // Mostrar mensaje del usuario en la conversación
    agregarMensaje(mensaje, true);
    input.value = "";   // Limpiar el campo de texto

    // Mostrar indicador "Escribiendo..."
    const loadingId = 'loading-' + Date.now();
    const messagesContainer = document.getElementById('chatMessages');
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'llama-message';
    loadingDiv.textContent = "Escribiendo...";
    messagesContainer.appendChild(loadingDiv);

    // Obtener respuesta de Groq
    const respuesta = await preguntarLlama(mensaje);

    // Eliminar el mensaje "Escribiendo..."
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    // Mostrar respuesta de la IA
    agregarMensaje(respuesta, false);
}

/**
 * Abre o cierra el panel del chat
 */
function toggleChat() {
    const chatContainer = document.getElementById('llamaChat');
    if (chatContainer) {
        chatContainer.classList.toggle('expanded');
    }
}

// Exponer funciones para manejadores inline en index.html
window.toggleChat = toggleChat;
window.enviarMensaje = enviarMensaje;

// ===================== INICIALIZACIÓN =====================
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chatInput');
    
    if (input) {
        // Enviar mensaje al presionar Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensaje();
            }
        });
    }

    // Mensaje de bienvenida automático
    setTimeout(() => {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            const welcome = document.createElement('div');
            welcome.className = 'llama-message';
            welcome.textContent = "¡Hola! Soy Lucy una IA trabajando gracias a la api que brinda Groq. ¿En qué te puedo ayudar sobre el portafolio de Duran Ruíz Juan Yahir?";
            messagesContainer.appendChild(welcome);
        }
    }, 800);
});
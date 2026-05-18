// =============================================
// LLAMA 3.2 - Chat Inteligente para Portafolio
// =============================================

// ===================== CONFIGURACIÓN =====================
const OLLAMA_URL = "http://localhost:11434/api/chat";   // Dirección donde corre Ollama
const MODEL_NAME = "llama3.2:3b";                       // Nombre exacto del modelo que tienes instalado

let chatHistory = [];   // Esta variable guarda toda la conversación (memoria)

// ===================== FUNCIÓN PRINCIPAL =====================
/**
 * Envía el mensaje a Llama 3.2 y devuelve la respuesta
 */
async function preguntarLlama(prompt) {
    try {
        // 1. Guardamos el mensaje del usuario en el historial
        chatHistory.push({ role: "user", content: prompt });

        // 2. Hacemos la petición a Ollama
        const response = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_NAME,           // Qué modelo usar
                
                messages: [                  // Historial de mensajes (formato oficial)
                    {
                        role: "system",      // Instrucciones permanentes para el modelo
                        content: `Eres un asistente profesional, amigable y entusiasta que representa el portafolio de Juan Yahir Durán Ruíz.
                                  Eres egresado de Ingeniería en Sistemas Computacionales del ITSUR.
                                  Responde siempre en español, de forma clara, positiva y profesional.
                                  No inventes información.`
                    },
                    ...chatHistory           // Incluimos toda la conversación anterior
                ],
                
                stream: false,               // false = esperamos la respuesta completa
                temperature: 0.7,            // Nivel de creatividad (0.0 = muy preciso, 1.0 = muy creativo)
                max_tokens: 700              // Máximo de palabras que puede responder
            })
        });

        // Verificamos si hubo error en la conexión
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();
        
        // Extraemos el texto que respondió Llama
        const respuesta = data.message.content;

        // Guardamos la respuesta en el historial para mantener contexto
        chatHistory.push({ role: "assistant", content: respuesta });

        return respuesta;

    } catch (error) {
        console.error("Error conectando con Ollama:", error);
        return "❌ No pude conectar con Llama 3.2.\n\nAsegúrate de que Ollama esté corriendo con:\nollama serve";
    }
}

// ===================== FUNCIONES DE LA INTERFAZ =====================

/**
 * Agrega un mensaje (usuario o Llama) al chat visualmente
 */
function agregarMensaje(texto, esUsuario) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = esUsuario ? 'user-message' : 'llama-message';
    mensajeDiv.textContent = texto;
    
    messagesContainer.appendChild(mensajeDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Baja automáticamente
}

/**
 * Función que se ejecuta cuando el usuario envía un mensaje
 */
async function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();

    if (!mensaje) return;

    // Mostrar mensaje del usuario
    agregarMensaje(mensaje, true);
    input.value = "";   // Limpiar el input

    // Mostrar indicador "Escribiendo..."
    const loadingId = 'loading-' + Date.now();
    const messagesContainer = document.getElementById('chatMessages');
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'llama-message';
    loadingDiv.textContent = "Escribiendo...";
    messagesContainer.appendChild(loadingDiv);

    // Obtener respuesta de Llama
    const respuesta = await preguntarLlama(mensaje);

    // Eliminar el mensaje "Escribiendo..."
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    // Mostrar respuesta de Llama
    agregarMensaje(respuesta, false);
}

/**
 * Abre o cierra el chat
 */
function toggleChat() {
    const chatContainer = document.getElementById('llamaChat');
    if (chatContainer) {
        chatContainer.classList.toggle('expanded');
    }
}

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
            welcome.textContent = "¡Hola! Soy Llama 3.2. Puedes preguntarme sobre los proyectos, tecnologías, experiencia o formación de Juan Yahir.";
            messagesContainer.appendChild(welcome);
        }
    }, 1000);
});
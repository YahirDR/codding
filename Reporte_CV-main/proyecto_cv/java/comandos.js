
function toggleSoftware() {
    const title = document.getElementById('softwareTitle');
    const content = document.getElementById('softwareContent');
    
    if (title && content) {
        title.classList.toggle('collapsed');
        content.classList.toggle('software-content-hidden');
    }
}
// Función para mostrar u ocultar el contenido de GitHub
function toggleGithub() {
    const title = document.getElementById('githubTitulo');
    const content = document.getElementById('githubContenido');
    
    if (title && content) {
        title.classList.toggle('collapsed');
        content.classList.toggle('github-ocultar');
    }
}

// Función para copiar email al portapapeles
function copiarEmail(event) {
    event.preventDefault();
    const email = 'juanawpnc@gmail.com';
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(email).then(function() {
        // Mostrar mensaje de confirmación
        const link = event.target.closest('.social-link');
        const originalText = link.querySelector('.social-name').textContent;
        
        link.querySelector('.social-name').textContent = '¡Copiado!';
        link.style.background = 'rgba(13, 59, 102, 0.5)';
        
        // Restaurar después de 2 segundos
        setTimeout(function() {
            link.querySelector('.social-name').textContent = originalText;
            link.style.background = '';
        }, 2000);
    }).catch(function(err) {
        alert('No se pudo copiar: ' + email);
    });
}



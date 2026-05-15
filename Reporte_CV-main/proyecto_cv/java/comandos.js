// Variables
const username = 'YahirDR';
// Lista de tus proyectos más importantes (cambia los nombres según tus repos)
const reposImportantes = [
    "final_project_web2",
    "analisis_numerico_algoritmos",
    "ProgramacionWebU2_ProyectoUnidad2",
    "TI2A-PROGR.MOVIL-I-DRJY"
   
];
//abrir y cerrar seccion de softwares usados en mis proyectos
function toggleSoftware() {
    const title = document.getElementById('softwareTitle');
    const content = document.getElementById('softwareContent');
    
    if (title && content) {
        title.classList.toggle('collapsed');
        content.classList.toggle('software-content-hidden');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    cargarReposGitHub();
});

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
// ==================== GITHUB API REST ====================
async function cargarReposGitHub() {
    const grid = document.getElementById('githubReposGrid');
    if (!grid) return;

    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Cargando proyectos importantes...</p>`;

    try {
        //llamada a la API de GitHub para obtener los repositorios del usuario
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        
        if (!response.ok) throw new Error("Error al obtener repositorios");

        const todosLosRepos = await response.json();

        // Filtrar solo los repositorios
        const reposFiltrados = todosLosRepos.filter(repo => 
            reposImportantes.includes(repo.name)
        );

        grid.innerHTML = ''; 

        if (reposFiltrados.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: orange;">
                No se encontraron los repositorios seleccionados.
            </p>`;
            return;
        }

        reposFiltrados.forEach(repo => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = "_blank";
            card.className = "github_proyecto";

            card.innerHTML = `
                <img src="../img/logo_codding.png" alt="${repo.name}" class="github_proyecto_img">
                <h3 class="github_proyecto_title">${repo.name}</h3>
                <p class="github_proyecto_desc">
                    ${repo.description ? repo.description : 'Sin descripción disponible.'}
                </p>
                <small style="display:block; margin-top:8px; color:#00ff88;">
                    ${repo.language ? '🔷 ' + repo.language : ''}
                    &nbsp;&nbsp;⭐ ${repo.stargazers_count}
                </small>
            `;

            grid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        grid.innerHTML = `<p style="grid-column: 1 / -1; color: red; text-align: center;">
            Error al cargar los proyectos. Inténtalo más tarde.
        </p>`;
    }
}
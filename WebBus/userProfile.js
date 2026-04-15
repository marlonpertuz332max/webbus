// Inicializar perfil de usuario
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre del usuario del localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    
    // Actualizar el nombre en el perfil
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = nombreUsuario;
    }
    
    // Obtener la primera letra del nombre para el avatar
    const inicialUsuario = nombreUsuario.charAt(0).toUpperCase();
    const userAvatarElement = document.querySelector('.user-avatar');
    if (userAvatarElement) {
        userAvatarElement.textContent = inicialUsuario;
    }
    
    // Toggle menú desplegable
    const userProfileElement = document.querySelector('.user-profile');
    if (userProfileElement) {
        userProfileElement.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }
    });
    
    // Cerrar sesión
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        // Limpiar localStorage
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('emailUsuario');
        localStorage.removeItem('usuarioLogueado');
        
        // Redirigir a login
        window.location.href = '../inicioSesion/inicioSesion.html';
    }
}

// Script de scroll para marcar sección activa
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('a.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') && current) {
            const pageMatch = link.getAttribute('href');
            if (pageMatch.includes(current) || current === link.getAttribute('data-page')) {
                link.classList.add('active');
            }
        }
    });
});

// Marcar página activa al cargar
function marcarPaginaActiva() {
    const paginaActual = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('a.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === paginaActual) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', marcarPaginaActiva);

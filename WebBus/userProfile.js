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
    
    // Toggle menú desplegable perfil (desktop)
    const userProfileElement = document.querySelector('.user-profile');
    if (userProfileElement) {
        userProfileElement.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }
    
    // ─── Hamburguesa Menu (Mobile) ─────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Insertar elementos del nav mobile
        if (!document.querySelector('.hamburger-btn')) {
            const hamburgerHTML = `
                <button class="hamburger-btn" aria-label="Menú">
                    <span></span><span></span><span></span>
                </button>
            `;
            // Insertar después del logo
            const logoArea = document.querySelector('.logo-area');
            if (logoArea) logoArea.insertAdjacentHTML('afterend', hamburgerHTML);
            
            // Clonar items del nav para el drawer
            const navLinks = Array.from(document.querySelectorAll('.nav-link')).map(link => link.outerHTML).join('');
            
            // Crear Overlay y Drawer
            const mobileHTML = `
                <div class="nav-overlay"></div>
                <div class="mobile-drawer">
                    <div class="mobile-drawer-user">
                        <div class="user-avatar-sm">${inicialUsuario}</div>
                        <div>
                            <div class="user-name-sm">${nombreUsuario}</div>
                            <div class="user-status-sm">Activo</div>
                        </div>
                    </div>
                    ${navLinks}
                    <div class="mobile-drawer-divider"></div>
                    <a href="#perfil">Ver Perfil</a>
                    <button class="btn-logout-mobile">Cerrar Sesión</button>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', mobileHTML);
        }

        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileDrawer = document.querySelector('.mobile-drawer');
        const navOverlay = document.querySelector('.nav-overlay');

        function toggleMenu() {
            hamburgerBtn.classList.toggle('open');
            mobileDrawer.classList.toggle('open');
            
            if (navOverlay.classList.contains('visible')) {
                navOverlay.classList.remove('visible');
                setTimeout(() => { navOverlay.style.display = 'none'; }, 300);
                document.body.style.overflow = '';
            } else {
                navOverlay.style.display = 'block';
                // Trigger reflow
                navOverlay.offsetWidth;
                navOverlay.classList.add('visible');
                document.body.style.overflow = 'hidden';
            }
        }

        hamburgerBtn.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);
        
        // Cerrar al click en links
        const drawerLinks = mobileDrawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileDrawer.classList.contains('open')) toggleMenu();
            });
        });

        // Logout mobile
        const btnLogoutMobile = document.querySelector('.btn-logout-mobile');
        if (btnLogoutMobile) {
            btnLogoutMobile.addEventListener('click', cerrarSesion);
        }
    }
    
    // Cerrar menú perfil al hacer clic fuera (desktop)
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

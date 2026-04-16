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
    
    // --- LÓGICA DE FOTO DE PERFIL ---
    const fotoPerfilData = localStorage.getItem('fotoPerfil');
    const updateAvatarsUI = (base64String) => {
        const avatars = document.querySelectorAll('.user-avatar, .user-avatar-sm');
        avatars.forEach(el => {
            if (base64String && base64String.length > 50) {
                el.innerHTML = `<img src="${base64String}" alt="Perfil" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                el.style.background = 'transparent';
                el.style.border = 'none';
            } else {
                el.innerHTML = inicialUsuario;
                el.style.background = '';
            }
        });
    };
    // Inicializar avatares
    updateAvatarsUI(fotoPerfilData);

    // Toggle menú desplegable perfil (desktop)
    const userProfileElement = document.querySelector('.user-profile');
    if (userProfileElement) {
        userProfileElement.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }

    // --- INYECTAR SISTEMA DE SUBIDA DE FOTO ---
    const fileInputTag = document.createElement('input');
    fileInputTag.type = 'file';
    fileInputTag.accept = 'image/jpeg, image/png, image/webp';
    fileInputTag.style.display = 'none';
    document.body.appendChild(fileInputTag);

    // Cuando detectemos un click en los botones/links de perfil (Fase de captura = inbloqueable)
    window.addEventListener('click', (e) => {
        const target = e.target.closest('a[href="#perfil"]');
        if (target) {
            e.preventDefault();
            fileInputTag.click(); // Abrir selector de archivos
        }
    }, true);

    // Procesar la foto seleccionada
    fileInputTag.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Comprimir imagen usando Canvas para no saturar la BD
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 200; // 200x200px máx
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a JPEG comprimido (0.8 quality = ~8-15KB)
                const base64Compressed = canvas.toDataURL('image/jpeg', 0.8);
                
                // Enviar al Backend
                subirFotoBackend(base64Compressed);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    function subirFotoBackend(base64Img) {
        const usuarioLogueadoStr = localStorage.getItem('usuarioLogueado');
        if (!usuarioLogueadoStr) return alert("Error: No estás logueado.");
        
        let id_usuario = 0;
        try {
            const userObj = JSON.parse(usuarioLogueadoStr);
            id_usuario = userObj.id || 0;
        } catch(e){}

        if(id_usuario === 0) return alert("Error de sesión. Inicia sesión nuevamente.");

        // Mostrar indicador de carga opcional aquí
        fetch('../api/upload-perfil.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: id_usuario,
                foto_perfil: base64Img
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Éxito: guardar en local y pintar UI
                localStorage.setItem('fotoPerfil', base64Img);
                updateAvatarsUI(base64Img);
            } else {
                alert('Hubo un error guardando la foto: ' + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error de red al intentar subir la foto.');
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

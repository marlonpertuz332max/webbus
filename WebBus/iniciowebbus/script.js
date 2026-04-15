// Detectar scroll y marcar la sección activa
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
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Función para establecer el enlace activo al hacer clic
function setActive(event) {
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

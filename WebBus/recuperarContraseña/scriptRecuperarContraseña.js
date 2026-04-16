// ============================================
// CONFIGURACIÓN DE EMAILJS
// ============================================

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'xhZNeWgXfG1_bIegD',
    SERVICE_ID: 'service_4dwljdy',
    TEMPLATE_ID: 'template_mduf3v1'
};

// Esperar a que EmailJS esté disponible
let emailjsReady = false;
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        emailjsReady = true;
        console.log('✅ EmailJS inicializado correctamente');
    } else {
        console.log('⏳ Esperando a EmailJS...');
        setTimeout(initializeEmailJS, 100);
    }
}

// Intentar inicializar inmediatamente
initializeEmailJS();

// También intentar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeEmailJS);

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

// Solicitar Token del SERVIDOR
async function requestRecoveryToken(email) {
    try {
        const response = await fetch('../api/request-password-recovery.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        console.log('📧 Respuesta del servidor:', data);
        
        if (response.ok && data.success) {
            return data.emailData; // Retorna objeto con todos los datos
        } else {
            throw new Error(data.error || 'Error al generar token');
        }
    } catch (error) {
        console.error('❌ Error solicitando token:', error);
        throw error;
    }
}

// Mostrar notificación mejorada
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        loading: '⏳',
        email: '📧'
    };
    const icon = icons[type] || icons.info;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        error: 'linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)',
        info: 'linear-gradient(135deg, #0a3d8f 0%, #1259c3 100%)',
        loading: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
        email: 'linear-gradient(135deg, #6f42c1 0%, #9a5bb5 100%)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 18px 24px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        font-size: 15px;
        z-index: 9999;
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-weight: 500;
        border-left: 4px solid #fff;
        max-width: 420px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// MANEJADOR DEL FORMULARIO
// ============================================

const enviar = document.getElementById('enviar');
const correo = document.getElementById('correo');

if (enviar && correo) {
    enviar.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = correo.value.trim();

        console.log('📨 Validando correo:', email);

        // Validación: correo vacío
        if (email === '') {
            showNotification('Por favor ingresa un correo electrónico', 'error');
            return;
        }

        // Validación: formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('El formato del correo no es válido', 'error');
            return;
        }

        // Cambiar estado del botón
        enviar.disabled = true;
        enviar.style.opacity = '0.7';
        enviar.style.cursor = 'not-allowed';
        const originalText = enviar.textContent;
        enviar.textContent = '⏳ Verificando...';

        showNotification('Verificando correo en la base de datos...', 'loading');

        // Obtener token del SERVIDOR
        let emailData;
        try {
            emailData = await requestRecoveryToken(email);
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
            enviar.disabled = false;
            enviar.style.opacity = '1';
            enviar.style.cursor = 'pointer';
            enviar.textContent = originalText;
            return;
        }

        // Verificar que EmailJS está listo
        if (!emailjsReady) {
            showNotification('EmailJS no está disponible. Intentando nuevamente...', 'loading');
            // Esperar a que EmailJS esté listo
            let attempts = 0;
            while (!emailjsReady && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!emailjsReady) {
                showNotification('Error: EmailJS no se puede cargar. Intenta nuevamente.', 'error');
                enviar.disabled = false;
                enviar.style.opacity = '1';
                enviar.style.cursor = 'pointer';
                enviar.textContent = originalText;
                return;
            }
        }

        // Si el servidor retorna datos, proceder a enviar correo con EmailJS
        enviar.textContent = '⏳ Enviando correo...';
        showNotification('Enviando enlace de recuperación a tu Gmail...', 'email');

        console.log('📧 Parámetros del correo:', emailData);

        // Enviar correo a través de EmailJS
        try {
            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                {
                    nombre: emailData.nombre,
                    correo: emailData.correo,
                    fecha: emailData.fecha,
                    link_recuperacion: emailData.link_recuperacion
                }
            );

            console.log('✅ Correo enviado exitosamente por EmailJS:', response);
            
            showNotification('✅ ¡Correo enviado exitosamente!', 'success');
            showNotification('📧 Revisa tu bandeja de entrada en Gmail (o spam)', 'info');
            
            correo.value = '';
            
            setTimeout(() => {
                window.location.href = '../recuperarContraseñaCorreo/recuperarContraseñaCorreo.html';
            }, 4000);
        } catch (error) {
            console.error('❌ Error al enviar correo con EmailJS:', error);
            
            showNotification('Error al enviar correo: ' + error.message, 'error');
            
            enviar.disabled = false;
            enviar.style.opacity = '1';
            enviar.style.cursor = 'pointer';
            enviar.textContent = originalText;
        }
    });
} else {
    console.error('❌ Elementos del formulario no encontrados en el HTML');
    if (!enviar) console.error('   - Falta elemento con ID: enviar');
    if (!correo) console.error('   - Falta elemento con ID: correo');
}

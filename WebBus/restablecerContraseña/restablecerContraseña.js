// ============================================================
// RESTABLECER CONTRASEÑA - SCRIPT
// ============================================================

// Obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Obtener el token de la URL
const recoveryToken = getUrlParameter('token');

// Mostrar notificación mejorada
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        loading: '⏳'
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
        loading: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
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

// ============================================================
// TOGGLE MOSTRAR/OCULTAR CONTRASEÑA
// ============================================================

document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const input = document.getElementById(this.dataset.target);
        const eyeIcon = this.querySelector('.eye-icon');
        const eyeOffIcon = this.querySelector('.eye-off-icon');
        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            input.type = 'password';
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    });
});

// ============================================================
// LÓGICA PRINCIPAL
// ============================================================

document.addEventListener("DOMContentLoaded", function() {
    // Verificar que exista un token válido
    if (!recoveryToken) {
        showNotification('Enlace de recuperación inválido o expirado.', 'error');
        setTimeout(() => {
            window.location.href = "../inicioSesion/inicioSesion.html";
        }, 3000);
        return;
    }

    console.log('🔐 Token recibido en URL:', recoveryToken);
    showNotification('Token de recuperación validando...', 'info');

    // Manejar el envío del formulario
    const form = document.getElementById("resetPasswordForm");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            console.log('📋 Validando contraseña...');

            // Validar que las contraseñas coincidan
            if (newPassword !== confirmPassword) {
                showNotification('Las contraseñas no coinciden. Intenta nuevamente.', 'error');
                return;
            }

            // Validar la longitud mínima de contraseña
            if (newPassword.length < 6) {
                showNotification('La contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }

            // Deshabilitar botón
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.textContent = '⏳ Actualizando...';
            showNotification('Actualizando contraseña...', 'loading');

            // Enviar al servidor para restablecer contraseña
            try {
                const response = await fetch('../api/reset-password.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: recoveryToken,
                        password: newPassword
                    })
                });

                const data = await response.json();
                console.log('📊 Respuesta del servidor:', data);

                if (response.ok && data.success) {
                    showNotification('✅ ' + data.message, 'success');
                    
                    setTimeout(() => {
                        window.location.href = "../inicioSesion/inicioSesion.html";
                    }, 3000);
                } else {
                    showNotification('❌ ' + (data.error || 'Error al restablecer contraseña'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                console.error('❌ Error:', error);
                showNotification('Error de conexión. Intenta nuevamente.', 'error');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.textContent = originalText;
            }
        });
    } else {
        console.error('❌ Formulario no encontrado');
    }
});


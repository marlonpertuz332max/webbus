document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const correo = document.getElementById('correo')?.value;
            const password = document.getElementById('password')?.value;
            
            if (!correo || !password) {
                mostrarError('Correo y contraseña son requeridos');
                return;
            }
            
            try {
                // Usamos ruta absoluta desde el root para evitar problemas en el hosting
                const response = await fetch('/api/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo,
                        password
                    })
                });
                
                // === MANEJO ROBUSTO DE RESPUESTA ===
                const responseText = await response.text();
                console.log('Respuesta del servidor:', response.status, responseText);
                
                if (!responseText || responseText.trim() === '') {
                    throw new Error(
                        'El servidor devolvió una respuesta vacía (status: ' + response.status + '). ' +
                        'Revisa los logs de Railway.'
                    );
                }
                
                let resultado;
                try {
                    resultado = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Respuesta no es JSON válido:', responseText);
                    throw new Error('El servidor no devolvió JSON válido. Posible error PHP.');
                }
                
                if (!response.ok || resultado.success === false || resultado.error) {
                    const mensajeError = resultado.debug 
                        ? `${resultado.error} (${resultado.debug})`
                        : resultado.debug_info 
                            ? `Error: ${resultado.error}. Detalles: ${resultado.debug_info.mysql_error}` 
                            : (resultado.error || 'Error en el inicio de sesión');
                    
                    console.error('Error del servidor:', resultado);
                    mostrarError(mensajeError);
                    return;
                }
                
                // Verificar que el servidor devolvió los datos del usuario
                if (!resultado.usuario) {
                    console.error('Respuesta inesperada del servidor:', resultado);
                    mostrarError('Respuesta inesperada del servidor: ' + JSON.stringify(resultado));
                    return;
                }
                
                // Guardar datos en localStorage
                localStorage.setItem('usuarioLogueado', JSON.stringify(resultado.usuario));
                localStorage.setItem('nombreUsuario', resultado.usuario.nombre);
                localStorage.setItem('emailUsuario', resultado.usuario.correo);
                
                mostrarExito('¡Sesión iniciada correctamente!');
                setTimeout(() => {
                    window.location.href = '../bienvenidaUsuario/bienvenidaUsuario.html';
                }, 1500);
                
            } catch (error) {
                mostrarError('Error de conexión: ' + error.message);
            }
        });
    }
    
    function mostrarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#3b82f6'
        });
    }
    
    function mostrarExito(mensaje) {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: mensaje,
            confirmButtonColor: '#3b82f6'
        });
    }
});

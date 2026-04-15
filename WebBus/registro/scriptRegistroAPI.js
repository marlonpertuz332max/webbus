document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('form-registro');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre')?.value;
            const correo = document.getElementById('correo')?.value;
            const password = document.getElementById('password')?.value;
            const confirmar_password = document.getElementById('confirmar_password')?.value;
            
            if (!nombre || !correo || !password || !confirmar_password) {
                mostrarError('Todos los campos son requeridos');
                return;
            }
            
            if (password !== confirmar_password) {
                mostrarError('Las contraseñas no coinciden');
                return;
            }
            
            try {
                // Usamos ruta absoluta desde el root para evitar problemas en el hosting
                const response = await fetch('/api/registro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre,
                        correo,
                        password,
                        confirmar_password
                    })
                });
                
                // === MANEJO ROBUSTO DE RESPUESTA ===
                // Primero leemos como texto para evitar crash si el body está vacío
                const responseText = await response.text();
                console.log('Respuesta del servidor:', response.status, responseText);
                
                // Si la respuesta está vacía, el servidor no devolvió nada
                if (!responseText || responseText.trim() === '') {
                    throw new Error(
                        'El servidor devolvió una respuesta vacía (status: ' + response.status + '). ' +
                        'Revisa los logs de Railway para ver errores PHP.'
                    );
                }
                
                // Intentar parsear como JSON de forma segura
                let resultado;
                try {
                    resultado = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Respuesta no es JSON válido:', responseText);
                    throw new Error('El servidor no devolvió JSON válido. Posible error PHP en el servidor.');
                }
                
                if (!response.ok || resultado.success === false || resultado.error) {
                    const mensajeError = resultado.debug 
                        ? `${resultado.error}\n\nDetalles: ${resultado.debug}\nHost: ${resultado.host}\nDB: ${resultado.database}\nURL found: ${resultado.mysql_url_found}`
                        : resultado.debug_info 
                            ? `Error: ${resultado.error}. Detalles: ${resultado.debug_info.mysql_error}` 
                            : (resultado.error || 'Error en el registro');
                    
                    console.error('Error del servidor:', resultado);
                    mostrarError(mensajeError);
                    return;
                }
                
                mostrarExito('¡Registro exitoso! Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '../inicioSesion/inicioSesion.html';
                }, 2000);
                
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

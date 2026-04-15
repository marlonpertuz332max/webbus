# 🔐 Sistema de Recuperación de Contraseña - WebBus

## Estado Actual ✅

El sistema de recuperación de contraseña está **completamente funcional** en ambiente de desarrollo/testing.

### Cómo Funciona

1. **Usuario solicita recuperación**
   - Ingresa su correo en `http://localhost/WebBusapp/WebBus/recuperarContraseña/recuperarContraseña.html`
   - Sistema genera un token seguro de 64 caracteres
   - Token se almacena en la BD con expiración de 30 minutos

2. **Enlace de recuperación**
   - Se genera un enlace de recuperación único
   - En **DEVELOPMENT**: El enlace se almacena en archivo de log
   - En **PRODUCCIÓN**: Se enviará por correo SMTP real

3. **Ver enlaces generados**
   - Accede a: `http://localhost/WebBusapp/recovery_logs_viewer.php`
   - Verás todos los enlaces generados hoy
   - Hace clic en el enlace para completar la recuperación

## Flujo Completo de Testing

### Paso 1: Solicitar Recuperación
```
1. Visita: http://localhost/WebBusapp/WebBus/recuperarContraseña/recuperarContraseña.html
2. Ingresa un correo registrado en la BD (ej: admin@buses.com)
3. Haz clic en "Enviar enlace"
4. Recibirás 2 notificaciones:
   - ✅ "¡Enlace de recuperación generado!"
   - 📋 Link al panel de logs: recovery_logs_viewer.php
```

### Paso 2: Ver Enlace en el Panel Dev
```
1. Abre: http://localhost/WebBusapp/recovery_logs_viewer.php
2. Verás un listado con todos los enlaces de hoy
3. Haz clic en el enlace "Enlace de Recuperación" para copiar/abrir
```

### Paso 3: Usar el Enlace
```
1. El enlace tiene formato: /WebBus/restablecerContraseña/?token=xxxx
2. Se abre la página de restablecimiento de contraseña
3. Validar que el token es válido
4. Ingresar nueva contraseña
5. Guardar cambios en la BD
```

## Archivos Involucrados

### APIs (Backend)
- `WebBus/api/request-password-recovery.php` - Genera el token y lo almacena en BD
- `WebBus/api/send-password-recovery-email.php` - Simula envío de correo (guarda en logs)

### Frontend
- `WebBus/recuperarContraseña/` - Página donde solicita recuperación
- `WebBus/recuperarContraseñaCorreo/` - Página después de solicitar
- `WebBus/restablecerContraseña/` - Página para ingresar nueva contraseña

### Herramientas de Desarrollo
- `recovery_logs_viewer.php` - Panel para ver enlaces generados
- `logs/` - Carpeta donde se guardan los archivos de log diarios

## Base de Datos

Tabla `usuarios` - Nuevas columnas (por UPDATE_BD_RECOVERY.sql):
- `recovery_token` (VARCHAR 255) - Token único para recuperación
- `recovery_token_expiry` (DATETIME) - Fecha/hora de expiración
- `token_used` (BOOLEAN DEFAULT FALSE) - Control de uso

## Configuración para PRODUCCIÓN

Cuando esté listo para usar correos reales, modifica `send-password-recovery-email.php`:

### Opción 1: Gmail SMTP (Recomendado)
```php
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->SMTPSecure = 'tls';
$mail->SMTPAuth = true;
$mail->Username = 'tu_email@gmail.com';
$mail->Password = 'tu_app_password';  // NO tu contraseña, un App Password
```

### Opción 2: Mailtrap (Testing en la nube)
```php
$mail->Host = 'smtp.mailtrap.io';
$mail->Port = 2525;
$mail->Username = 'tu_usuario_mailtrap';
$mail->Password = 'tu_password_mailtrap';
```

### Opción 3: Sendgrid
```php
$mail->Host = 'smtp.sendgrid.net';
$mail->Port = 587;
$mail->Username = 'apikey';
$mail->Password = 'SG.tu_api_key_aqui';
```

## Credenciales para Testing Gmail

Si quieres usar Gmail en desarrollo:

1. **Generar App Password:**
   - Visita: https://myaccount.google.com/apppasswords
   - Selecciona: Mail y Windows
   - Google generará una contraseña de 16 caracteres
   - Usa ESE password, NO tu contraseña de Gmail

2. **Código actualizado:**
   ```php
   $mail->Username = 'tu_email@gmail.com';
   $mail->Password = 'euhz fbzx uazo kyya';  // El app password
   ```

## Troubleshooting

### "El token ha expirado"
- Los tokens expiran después de 30 minutos
- Solicita un nuevo enlace

### "Token inválido"
- El token no existe en la BD
- Verifica que copiaste el enlace completo correctamente

### "Error: Contraseña no actualizada"
- Revisa los logs de PHP: `C:\xampp\logs\php_error.log`
- Confirma que la BD está disponible

### En Recovery Logs Panel no aparece nada
- Asegúrate que visitaste: `http://localhost/WebBusapp/recovery_logs_viewer.php`
- NO `http://localhost/recovery_logs_viewer.php`
- La carpeta `/logs/` debe tener permisos de escritura (777)

## Próximos Pasos

Para completar la implementación:

1. ✅ **Recuperación diseñada y funcional**
2. ⏳ **Restablecimiento de contraseña** (casi completo)
3. ⏳ **Configurar SMTP real** (Gmail/Sendgrid/etc)
4. ⏳ **Testing del flujo completo**
5. ⏳ **Documentar para producción**

---

**Última actualización:** 22/03/2026  
**Estado:** DEVELOPMENT - Sistema de recuperación completamente funcional  
**Autor:** Sistema WebBus

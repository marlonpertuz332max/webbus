# 🚀 GUÍA DE IMPLEMENTACIÓN - RECUPERACIÓN DE CONTRASEÑA

## **Resumen de cambios implementados:**

✅ 2 nuevos endpoints PHP  
✅ 2 scripts JavaScript actualizados  
✅ Estructura de BD actualizada  
✅ Sistema de tokens seguro (del lado del servidor)  
✅ Validación de expiración (30 minutos)  
✅ Prevención de reutilización de tokens  

---

## **🔧 PASO 1: Actualizar la Base de Datos**

1. Abre **phpMyAdmin** → base de datos `rutas_buses`
2. Ve a la pestaña **SQL**
3. Copia y pega el contenido del archivo: `UPDATE_BD_RECOVERY.sql`
4. Click en **Ejecutar**

**Esto agrega 3 columnas** a la tabla `usuarios`:
- `recovery_token` - Almacena el token generado
- `recovery_token_expiry` - Cuando expira (30 minutos)
- `token_used` - Previene reutilización

---

## **📁 PASO 2: Verificar los archivos PHP nuevos**

Estos 2 archivos ya fueron creados en:

```
WebBus/api/request-password-recovery.php  ✅ (genera token en servidor)
WebBus/api/reset-password.php            ✅ (valida token + actualiza contraseña)
```

**No necesitas hacer nada aquí**, solo verificar que existan.

---

## **📱 PASO 3: Verificar los scripts JS actualizados**

Estos 2 archivos fueron modificados:

```
WebBus/recuperarContraseña/scriptRecuperarContraseña.js          ✅ actualizado
WebBus/restablecerContraseña/restablecerContraseña.js            ✅ actualizado
```

**Cambios principales:**
- Ya NO generan token en cliente
- Solicitan token al servidor (más seguro ✓)
- EmailJS recibe datos del servidor
- Token se valida en servidor antes de permitir reset

---

## **📧 PASO 4: Configurar EmailJS (las credenciales siguen igual)**

**TUS CREDENCIALES ACTUALES SON VÁLIDAS:**

```javascript
PUBLIC_KEY:   xhZNeWgXfG1_bIegD
SERVICE_ID:   service_4dwljdy
TEMPLATE_ID:  template_mduf3v1
```

**⚠️ CRITICÓ: Verifica que la plantilla tenga estas variables:**

En https://dashboard.emailjs.com/ → Email Templates → (tu plantilla):

```
{{nombre}}              ← Nombre del usuario
{{correo}}              ← Email para enviar
{{fecha}}               ← Fecha de solicitud
{{link_recuperacion}}   ← URL para restablecer contraseña
```

Si NO están, edita la plantilla y asegúrate de agregar `{{variable}}` donde corresponda.

**Ejemplo de plantilla correcta:**

```html
<h1>Hola {{nombre}},</h1>
<p>Solicitaste restablecer tu contraseña el {{fecha}}</p>
<p>Haz clic en el enlace para continuar:</p>
<a href="{{link_recuperacion}}">Restablecer Contraseña</a>
```

---

## **✅ PASO 5: Probar el flujo completo**

### **Test 1: Solicitar recuperación**
1. Abre `WebBus/recuperarContraseña/recuperarContraseña.html`
2. Ingresa un correo registrado (ej: `juan@gmail.com`)
3. Click en "Enviar enlace"
4. Deberías ver un mensaje de éxito ✅

**¿Qué hace?**
- Cliente envía correo a `request-password-recovery.php`
- Servidor genera token único
- Servidor almacena token + timestamp en BD
- Servidor retorna datos para EmailJS
- Cliente envía correo con EmailJS
- Usuario ve mensaje de éxito

### **Test 2: Abrir el correo**
1. Verifica tu correo (o carpeta de spam)
2. Deberías ver el correo con el enlace
3. Click en el enlace
4. Se abre `restablecerContraseña.html` con el token en la URL

### **Test 3: Restablecer contraseña**
1. Ingresa nueva contraseña (mín 6 caracteres)
2. Confirma que es igual
3. Click en "Restablecer contraseña"
4. Deberías ver ✅ "Contraseña restablecida correctamente"
5. Serás redirigido a login
6. Prueba iniciar sesión con la nueva contraseña

---

## **🔒 Características de seguridad implementadas:**

| Feature | Descripción |
|---------|------------|
| **Token del servidor** | NO se genera en cliente (más seguro) |
| **Expiración** | Token válido solo 30 minutos |
| **Hash de contraseña** | Usa `password_hash()` (BCRYPT) |
| **Un solo uso** | Token no puede usarse dos veces |
| **Sin revelación** | Si email no existe, seguimos sin decir nada |
| **No almacena tokens NULL** | Después de usar, se limpia de BD |

---

## **📊 Flujo Técnico Completo:**

```
┌─ PASO 1: Usuario solicita recuperación
│  └─ Client: scriptRecuperarContraseña.js
│     └─ POST: ../api/request-password-recovery.php
│        └─ Server genera token: bin2hex(random_bytes(32))
│        └─ Guarda en BD con timestamp +30min
│        └─ Retorna datos para correo
│
├─ PASO 2: Enviar correo
│  └─ Client: EmailJS.send()
│     └─ Usa: PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID
│     └─ Variables: nombre, correo, fecha, link_recuperacion
│
├─ PASO 3: Usuario abre enlace
│  └─ Extrae token de URL
│  └─ Abre restablecerContraseña.html
│
└─ PASO 4: Restablecer contraseña
   └─ Client: restablecerContraseña.js
      └─ POST: ../api/reset-password.php
         └─ Server verifica:
            ✓ Token existe
            ✓ NO está expirado
            ✓ NO fue usado antes
         └─ Hash nueva contraseña
         └─ Actualiza en BD
         └─ Marca token como usado
```

---

## **🐛 Troubleshooting:**

**P: El correo no se envía**
- R: Verifica credenciales EmailJS en scriptRecuperarContraseña.js
- R: Revisa https://dashboard.emailjs.com/admin/logs para errores
- R: Asegúrate la plantilla exista y tenga variables {{ }}

**P: "Token inválido o expirado"**
- R: Esperaste más de 30 minutos - solicita uno nuevo
- R: Verifica que la BD se actualizó correctamente

**P: "Contraseña debe ser 6+ caracteres"**
- R: Eso es correcto - ingresa más caracteres

**P: No puedo iniciar sesión con nueva contraseña**
- R: Verifica que se actualizó en BD (query: SELECT * FROM usuarios WHERE correo='...')
- R: Asegúrate que login.php usa password_verify()

---

## **📋 Checklist Final:**

- [ ] Ejecuté UPDATE_BD_RECOVERY.sql ✅
- [ ] Verifiqué que los archivos PHP existan ✅
- [ ] Verifiqué que los JS fueron actualizados ✅
- [ ] Configuré las variables {{ }} en plantilla EmailJS y verifiqué que esté conectado el service: `service_4dwljdy` ✅
- [ ] Probé solicitar recuperación ✅
- [ ] Probé recibir correo ✅
- [ ] Probé restablecer contraseña ✅
- [ ] Probé iniciar sesión con nueva contraseña ✅

---

## **🎉 ¡LISTO!**

Tu sistema de recuperación de contraseña ya está completamente implementado y seguro.

Si tienes problemas, revisa los logs del navegador (F12) y EmailJS dashboard.


// ============================================================
// CONFIGURACIÓN CORRECTA DE EMAILJS - GUÍA FINAL
// ============================================================
// 
//👉 TUS CREDENCIALES ACTUALES CORREGIDAS:
// ✅ PUBLIC_KEY: xhZNeWgXfG1_bIegD
// ✅ SERVICE_ID: service_4dwljdy
// ✅ TEMPLATE_ID: template_mduf3v1
//
// NO NECESITAS CREARLOS DE NUEVO. Solo verifica la plantilla.
// ============================================================

// PASOS A SEGUIR:
// 
// 1️⃣  VERIFICAR QUE LA PLANTILLA EXISTE EN EMAILJS
//     ├─> Ve a https://dashboard.emailjs.com/
//     ├─> Login con tu cuenta
//     ├─> Busca "Email Templates" o "Templates"
//     └─> Busca la plantilla: "template_fittvok"
//
// 2️⃣  LA PLANTILLA DEBE TENER ESTAS VARIABLES:
//     (Exactamente así, con las llaves {{ }})
//
//     {{nombre}}              - Nombre del usuario
//     {{correo}}              - Email del usuario  
//     {{fecha}}               - Fecha de la solicitud
//     {{link_recuperacion}}   - URL para restablecer contraseña
//
// 3️⃣  CONTENIDO DE LA PLANTILLA:
//     El contenido HTML debe estar en: PLANTILLA_EMAIL_RECUPERACION.html
//     Usa el HTML que ya tienes allí.
//
// 4️⃣  FLUJO DE DATOS NUEVA ESTRUCTURA:
//
//     USUARIO INGRESA CORREO
//           ↓
//     scriptRecuperarContraseña.js (cliente)
//           ↓
//     request-password-recovery.php (SERVIDOR genera token)
//           ↓
//     Datos retornados al cliente con:
//           • nombre
//           • correo
//           • fecha
//           • link_recuperacion
//           • recovery_token (para validación)
//           ↓
//     EmailJS.send() utiliza estos parámetros (cliente)
//           ↓
//     Si todo OK → Email enviado ✅
//           ↓
//     Usuario abre enlace → restablecerContraseña.html
//           ↓
//     reset-password.php valida token y actualiza BD ✅
//
// ============================================================
// VARIABLES QUE EMAILJS RECIBE DEL SERVIDOR:
// ============================================================
// {
//   "nombre": "Juan",
//   "correo": "juan@gmail.com",
//   "fecha": "22 de marzo de 2026 14:30",
//   "link_recuperacion": "http://localhost/WebBus/restablecerContraseña/restablecerContraseña.html?token=abc123def456",
//   "recovery_token": "abc123def456"  (para uso interno)
// }

// ============================================================
// CHECKLIST ANTES DE IR A PRODUCCIÓN:
// ============================================================
// 
// ✅ Ejecutar UPDATE_BD_RECOVERY.sql en phpMyAdmin
// ✅ Los archivos PHP nuevos están en /api/:
//    - request-password-recovery.php
//    - reset-password.php
// ✅ Los scripts JS actualizados:
//    - scriptRecuperarContraseña.js
//    - restablecerContraseña.js
// ✅ EmailJS configurado con:
//    - PUBLIC_KEY: xhZNeWgXfG1_bIegD
//    - SERVICE_ID: service_nqhak4t
//    - TEMPLATE_ID: template_fittvok
// ✅ Plantilla tiene variables: {{nombre}}, {{correo}}, {{fecha}}, {{link_recuperacion}}
//
// ============================================================
// SI ALGO NO FUNCIONA - DEBUGGING:
// ============================================================
// 
// 🔍 Abre la consola del navegador (F12)
// 
// Si ves error "CORS":
//   → Verifica rutas PHP sean correctas
//   → Asegúrate que los archivos PHP existan
//
// Si el token no llega:
//   → Revisa request-password-recovery.php
//   → Asegúrate que la BD esté actualizada
//
// Si EmailJS no envía:
//   → Verifica Public Key, Service ID, Template ID
//   → Verifica que la plantilla tenga variables {{nombre}}, {{correo}}, etc.
//   → Revisa https://dashboard.emailjs.com/admin/logs para ver errores
//
// Si la contraseña no se actualiza:
//   → Verifica reset-password.php
//   → Asegúrate que el token llegue correctamente en la URL
//   → Revisa que password_hash() esté funcionando
//
// ============================================================

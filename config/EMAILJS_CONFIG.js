// ============================================
// CONFIGURACIÓN DE EMAILJS - INSTRUCCIONES
// ============================================
// 
// 1. Ve a https://www.emailjs.com/ 
// 2. Crea una cuenta gratuita (Sign Up)
// 3. En el dashboard, abre "Integrations" o "Services"
// 4. Conecta tu servicio de correo:
//    - Gmail: Selecciona Gmail en la lista
//    - O usa otro (Outlook, Yahoo, etc.)
// 5. Obtén tu PUBLIC_KEY en "Account" > "API Keys"
// 6. Obtén SERVICE_ID después de conectar el servicio
// 7. Ve a "Email Templates" y crea una plantilla:
//
// ────────────────────────────────────────
// CONFIGURACIÓN DE LA PLANTILLA:
// ────────────────────────────────────────
// Nombre: recovery_password_template (o el que prefieras)
// ID deseado: recovery_password_template
// Receptor: {{correo}}
// Asunto: WebBus - Recuperación de contraseña
// Contenido: Pegue COMPLETAMENTE el HTML de PLANTILLA_EMAIL_RECUPERACION.html
//
// VARIABLES A USAR EN LA PLANTILLA:
// - {{nombre}}              : Nombre del usuario
// - {{correo}}              : Email del usuario
// - {{fecha}}               : Fecha y hora de la solicitud
// - {{link_recuperacion}}   : Enlace para restablecer contraseña
//
// 8. Obtén el TEMPLATE_ID después de crear la plantilla
// 9. Reemplaza en scriptRecuperarContraseña.js:
//    - "YOUR_PUBLIC_KEY_HERE" → tu Public Key
//    - "YOUR_SERVICE_ID_HERE" → tu Service ID
//    - "YOUR_TEMPLATE_ID_HERE" → tu Template ID
//
// ────────────────────────────────────────
// PASOS DETALLADOS:
// ────────────────────────────────────────
// 
// PASO 1: Obtener credenciales
// ├─ Login en emailjs.com
// ├─ Account > API Keys
// ├─ Copia "Public Key" 
// ├─ Selecciona o crea un Service (Gmail, etc.)
// └─ Copia "Service ID"
//
// PASO 2: Crear plantilla de correo
// ├─ Ve a Email Templates
// ├─ Click "Create New Template"
// ├─ Nombre: "recovery_password_template"
// ├─ Receptor: {{correo}}
// ├─ Asunto: WebBus - Recuperación de contraseña
// ├─ Content: 
// │  ├─ Click "Code Editor"
// │  ├─ Limpia el HTML por defecto
// │  ├─ Abre PLANTILLA_EMAIL_RECUPERACION.html
// │  ├─ Copia TODO el contenido entre <html>...</html>
// │  ├─ Pega en el editor de EmailJS
// │  └─ Save
// ├─ Email Template ID aparecerá en la URL o en los detalles
// └─ Copia ese ID
//
// PASO 3: Actualizar scriptRecuperarContraseña.js
// ├─ Abre el archivo scriptRecuperarContraseña.js
// ├─ Línea 15: emailjs.init("YOUR_PUBLIC_KEY_HERE")
// │  └─ Reemplaza con tu Public Key
// ├─ Línea 47: emailjs.send("YOUR_SERVICE_ID_HERE", ...)
// │  └─ Reemplaza "YOUR_SERVICE_ID_HERE" con tu Service ID
// └─ Línea 47: emailjs.send(..., "YOUR_TEMPLATE_ID_HERE", ...)
//    └─ Reemplaza "YOUR_TEMPLATE_ID_HERE" con tu Template ID
//
// ────────────────────────────────────────
// EJEMPLO FINAL (después de configurar):
// ────────────────────────────────────────
// emailjs.init("your_public_key_123abc...");
// emailjs.send("service_gmail_xyz...", "recovery_password_template", templateParams)
//
// ────────────────────────────────────────
// VARIABLES QUE SE ENVÍAN AUTOMÁTICAMENTE:
// ────────────────────────────────────────
// El script envía estos parámetros al correo:
// {
//   nombre: "joshua",              // extraído del email
//   correo: "joshua@gmail.com",    // lo que escribió el usuario
//   fecha: "21 de marzo de 2026",  // fecha y hora actual
//   link_recuperacion: "https://..."  // enlace único con token
// }

console.log("📧 EmailJS configurado en: recuperarContraseña/scriptRecuperarContraseña.js");

# ⚙️ Configuración Final de EmailJS - Recuperación de Contraseña

## ✅ Lo que ya está listo en WebBus

Tu aplicación ya tiene:
- **PUBLIC_KEY**: `xhZNeWgXfG1_bIegD`
- **SERVICE_ID**: `service_4dwljdy`
- **TEMPLATE_ID**: `template_mduf3v1`

Y envía estos datos al correo:
- `nombre`: nombre del usuario
- `correo`: email del usuario  
- `fecha`: fecha y hora de solicitud
- `link_recuperacion`: enlace para restablecer contraseña

---

## 🔧 VERIFICAR TU PLANTILLA EN EMAILJS

Debes verificar que tu plantilla en EmailJS.io esté configurada EXACTAMENTE así:

### 1️⃣ Corre a EmailJS.io
Sección: **Email Templates**

### 2️⃣ Abre tu plantilla con ID: `template_mduf3v1`

### 3️⃣ Verifica estos CAMPOS EXACTOS (usa el Code Editor):

**Receptor del correo:**
```
{{correo}}
```

**Asunto:**
```
WebBus - Recuperación de Contraseña
```

**Contenido HTML** (usa estas VARIABLES EXACTAS):
```html
<html>
<body style="font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #667eea; text-align: center;">WebBus - Recuperación de Contraseña</h2>
        <p>¡Hola <strong>{{nombre}}</strong>!</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo:</p>
        <p style="margin: 20px 0; text-align: center;">
            <a href="{{link_recuperacion}}" style="display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
        </p>
        <p>O copia y pega este enlace:</p>
        <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">{{link_recuperacion}}</p>
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0;">
            <strong>⚠️ IMPORTANTE:</strong><br>
            • Este enlace expirará en 30 minutos<br>
            • Si no solicitaste esto, ignora este correo<br>
            • No compartas este enlace con nadie
        </div>
        <p style="color: #666; font-size: 12px;">Solicitado: {{fecha}}</p>
        <hr>
        <p style="color: #999; font-size: 11px; text-align: center;">© 2026 Web Bus</p>
    </div>
</body>
</html>
```

### 4️⃣ Click en SAVE

---

## 🧪 PROBAR AHORA

Con todo configurado:

1. Ve a: `http://localhost/WebBusapp/WebBus/recuperarContraseña/recuperarContraseña.html`
2. Ingresa: `admin@buses.com` (usuario registrado)
3. Haz click: "Enviar enlace"
4. ¡El correo debe llegar a tu Gmail en 5 segundos!

---

## 📋 Variables en la Plantilla (IMPORTANTES)

Estas son las variables que WebBus envía. **DEBEN coincidir exactamente en tu plantilla:**

```
{{nombre}}              ← Nombre del usuario registrado
{{correo}}              ← Email del usuario (inclue aquí en "Receptor")  
{{fecha}}               ← Fecha y hora de la solicitud
{{link_recuperacion}}   ← Enlace único para restablecer contraseña
```

---

## ❌ Si No Funciona

**Paso 1: Verifica que EmailJS esté inicializado**
- Abre la consola del navegador (F12)
- Espera 2-3 segundos
- Deberías ver: `✅ EmailJS inicializado correctamente`

**Paso 2: Verifica la plantilla**
- Las variables deben estar entre `{{` y `}}`
- Ejemplo: `{{nombre}}` NO `{{Nombre}}` (case sensitive)

**Paso 3: Verifica las credenciales**
- PUBLIC_KEY: `xhZNeWgXfG1_bIegD` ✓
- SERVICE_ID: `service_4dwljdy` ✓
- TEMPLATE_ID: `template_mduf3v1` ✓

**Paso 4: Revisa la consola**
- F12 en el navegador
- Ve a pestaña "Console"
- Busca mensajes de error

---

## 🎯 Cuando Todo Funcione

✅ Usuario ingresa email  
✅ Genera token en BD  
✅ EmailJS envía correo  
✅ Usuario recibe en Gmail  
✅ Usuario copia enlace y restablece contraseña  

**¿Estás listo? Verifica tu plantilla en EmailJS y prueba!** 🚀

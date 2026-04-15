# 🚀 Guía de Instalación - WebBus

## 1. CREAR LA BASE DE DATOS

### Opción A: Con phpMyAdmin (Recomendado)
1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. En el panel izquierdo, haz clic en "Nueva" o "New Database"
3. Nombre de la BD: `rutas_buses`
4. Haz clic en "Crear"
5. Una vez creada, selecciona `rutas_buses` en el panel izquierdo
6. Haz clic en la pestaña "Importar" (Import)
7. Haz clic en "Seleccionar archivo" (Choose File)
8. Busca el archivo: `C:\xampp\htdocs\WebBusapp\rutas_buses.sql`
9. Haz clic en "Ejecutar" (Execute/Import)

### Opción B: Con MySQL Command Line
```bash
mysql -u root -p
CREATE DATABASE rutas_buses;
USE rutas_buses;
SOURCE C:\xampp\htdocs\WebBusapp\rutas_buses.sql;
```

---

## 2. VERIFICAR LA CONFIGURACIÓN

El archivo `config.php` ya tiene los datos correctos:
- **Host**: localhost
- **Usuario**: root
- **Contraseña**: (vacía)
- **Base de Datos**: rutas_buses

Si tu contraseña de root es diferente, actualiza en:
`C:\xampp\htdocs\WebBusapp\WebBus\config.php`

---

## 3. APIS DISPONIBLES

Todas las APIs retornan JSON y están ubicadas en `/WebBus/api/`

### 📝 POST `/api/registro.php`
Registra un nuevo usuario
```json
{
  "nombre": "Juan Perez",
  "correo": "juan@example.com",
  "password": "123456",
  "confirmar_password": "123456"
}
```

### 🔐 POST `/api/login.php`
Inicia sesión de usuario
```json
{
  "correo": "juan@example.com",
  "password": "123456"
}
```

### 📋 GET `/api/get-rutas.php`
Obtiene todas las rutas disponibles
Respuesta:
```json
{
  "success": true,
  "total": 6,
  "rutas": [...]
}
```

### 🚏 GET `/api/get-paradas.php`
Obtiene todas las paradas
Respuesta:
```json
{
  "success": true,
  "total": 28,
  "paradas": [...]
}
```

### 🚌 GET `/api/get-buses.php`
Obtiene todos los buses
Respuesta:
```json
{
  "success": true,
  "total": 6,
  "buses": [...]
}
```

---

## 4. USUARIOS DE PRUEBA

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@buses.com | 123456 | Administrador |
| juan@gmail.com | 123456 | Usuario |
| maria@gmail.com | 123456 | Usuario |
| carlos@gmail.com | 123456 | Usuario |

---

## 5. ESTRUCTURA DE CARPETAS

```
WebBus/
├── config.php              ← Configuración BD
├── index.html              ← Página principal
├── cargarDatos.js          ← Script para cargar rutas/paradas
├── userProfile.js          ← Script de perfil de usuario
├── navbar.css              ← Estilos navbar
├── api/
│   ├── registro.php        ← API de registro
│   ├── login.php           ← API de login
│   ├── get-rutas.php       ← API obtener rutas
│   ├── get-paradas.php     ← API obtener paradas
│   └── get-buses.php       ← API obtener buses
├── registro/
│   ├── registro.html       ← Formulario registro
│   └── scriptRegistroAPI.js ← Script registro
├── inicioSesion/
│   ├── inicioSesion.html   ← Formulario login
│   └── scriptLoginAPI.js   ← Script login
├── iniciowebbus/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── [otras carpetas...]
```

---

##6. PRUEBAS RÁPIDAS

### Probar Registro:
1. Ve a: http://localhost/WebBusapp/WebBus/registro/registro.html
2. Completa el formulario
3. Deberías ver un mensaje de éxito

### Probar Login:
1. Ve a: http://localhost/WebBusapp/WebBus/inicioSesion/inicioSesion.html
2. Usa: juan@gmail.com / 123456
3. Deberías redirigirte a la página de bienvenida

### Probar APIs (en navegador):
- http://localhost/WebBusapp/WebBus/api/get-rutas.php
- http://localhost/WebBusapp/WebBus/api/get-paradas.php
- http://localhost/WebBusapp/WebBus/api/get-buses.php

---

## ⚠️ PUNTOS IMPORTANTES

✅ **Seguridad:**
- ✓ Las contraseñas se almacenan hasheadas (BCRYPT)
- ✓ Las APIs validan los datos
- ✓ Se previene SQL injection

⚠️ **A futuro:**
- Implementar CORS más restrictivo
- Agregar rate limiting
- Usar HTTPS en producción
- Validaciones adicionales en frontend

---

## 🆘 Si hay problemas:

1. **Error de conexión a BD:**
   - Verifica que XAMPP está ejecutándose
   - Abre phpMyAdmin y confirma que la BD existe

2. **500 Internal Server Error:**
   - Revisa la configuración en config.php
   - Verifica permisos de carpetas

3. **Las APIs no cargan:**
   - Abre la consola del navegador (F12)
   - Verifica que las rutas a las APIs sean correctas

---

✨ **¡La aplicación está lista para usar!**

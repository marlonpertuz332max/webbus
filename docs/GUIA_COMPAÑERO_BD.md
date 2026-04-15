# 📋 GUÍA PARA COMPAÑERO - IMPLEMENTACIÓN BASE DE DATOS

**Para**: Aplicación WebBus  
**Fecha**: 22 de marzo de 2026  
**Prioridad**: ⚠️ IMPORTANTE - Ejecutar ANTES de probar recuperación de contraseña  

---

## 🎯 OBJETIVO

Actualizar la base de datos `rutas_buses` para que funcione el **sistema de recuperación de contraseña**.

---

## ✅ REQUISITOS PREVIOS

- ✅ Tener **phpMyAdmin** instalado y funcionando
- ✅ Base de datos `rutas_buses` ya creada
- ✅ Acceso a `localhost/phpmyadmin` (o servidor donde esté la BD)
- ✅ Usuario y contraseña de MySQL

---

## 🚀 PASOS A EJECUTAR

### **PASO 1: Acceder a phpMyAdmin**

```
1. Abre tu navegador
2. Ve a: http://localhost/phpmyadmin
3. Selecciona la base de datos: rutas_buses
```

**Si no está disponible:**
- Asegúrate que XAMPP/WAMP esté ejecutándose
- Verifica que el servidor MySQL esté activo

---

### **PASO 2: Ubicar el archivo SQL**

El archivo está en:
```
📁 WebBusapp/
  └─ 📁 database/
     └─ 📄 UPDATE_BD_RECOVERY.sql   ← ESTE ARCHIVO
```

---

### **PASO 3: Ejecutar el SQL en phpMyAdmin**

#### **Opción A: Copiar y pegar (RECOMENDADO)**

1. **Abre el archivo** `UPDATE_BD_RECOVERY.sql` con nota o editor
   - Click derecho → Abrir con → Notepad o tu editor

2. **Copia TODO el contenido** (Ctrl+A → Ctrl+C)

3. **En phpMyAdmin:**
   - Click en la pestaña **"SQL"**
   - Pega el código en el cuadro de texto (Ctrl+V)
   - Click en botón **"Ejecutar"** (abajo a la derecha)

   ```
   Expected output (éxito):
   ✅ Consultas ejecutadas exitosamente
   ✅ Tabla usuarios actualizada con nuevas columnas
   ```

#### **Opción B: Importar archivo (ALTERNATIVA)**

1. **En phpMyAdmin:**
   - Click en pestaña **"Importar"**
   - Click en **"Seleccionar archivo"**
   - Busca: `WebBusapp/database/UPDATE_BD_RECOVERY.sql`
   - Click en **"Ejecutar"**

---

### **PASO 4: Verificar que funcionó ✅**

1. **En phpMyAdmin:**
   - Haz click en tabla **"usuarios"**
   - Haz click en pestaña **"Estructura"**

2. **Deberías ver 3 columnas NUEVAS:**
   ```
   ✅ recovery_token          (VARCHAR, 255)
   ✅ recovery_token_expiry   (DATETIME)
   ✅ token_used              (BOOLEAN)
   ```

3. **Si las ves → ¡LISTO! ✅**

---

## 🔍 VALIDACIÓN FINAL

### **Para asegurar que todo está correcto:**

Ejecuta esta consulta en phpMyAdmin (SQL):

```sql
DESCRIBE usuarios;
```

**Should show:**
```
id_usuario                int(11)       ✓
nombre                    varchar(100)  ✓
correo                    varchar(100)  ✓
password                  varchar(255)  ✓
tipo_usuario              enum          ✓
fecha_registro            timestamp     ✓
recovery_token            varchar(255)  ← NUEVA ✓
recovery_token_expiry     datetime      ← NUEVA ✓
token_used                tinyint(1)    ← NUEVA ✓
```

---

## ⚠️ SI ALGO SALE MAL

### **Error 1: "Syntax error near 'ALTER TABLE'"**
- **Causa**: Copié mal el SQL o está incompleto
- **Solución**: Abre nuevamente `UPDATE_BD_RECOVERY.sql` y copia TODO

### **Error 2: "Table usuarios doesn't exist"**
- **Causa**: La tabla `usuarios` no existe
- **Solución**: 
  1. Primero ejecuta `rutas_buses.sql` (tabla usuarios base)
  2. Luego ejecuta `UPDATE_BD_RECOVERY.sql`

### **Error 3: "Duplicate key name"**
- **Causa**: Las columnas ya existen (ya fue ejecutado)
- **Solución**: ¡OK! Ya está hecho, no hagas nada más

### **Error 4: "Access denied"**
- **Causa**: Sin permisos en la BD
- **Solución**: 
  1. Verifica que iniciaste sesión con usuario `root` o admin
  2. Comprueba que tengas permisos en BD `rutas_buses`

---

## 📝 RESUMEN DE CAMBIOS

El script agrega estas capacidades:

| Feature | Antes | Después |
|---------|-------|---------|
| Recuperación contraseña | ❌ No funciona | ✅ Funciona |
| Token seguro | No existe | Generado en servidor |
| Expiración | No existe | 30 minutos |
| Reutilización | Sin control | Previene reutilización |

---

## 🔐 CREDENCIALES DE BD

Si necesitas conectar directamente a MySQL:

```
Host:     localhost
User:     root
Password: (vacío o tu contraseña)
DB:       rutas_buses
Port:     3306
```

---

## ✅ CHECKLIST FINAL

- [ ] Abrí phpMyAdmin correctamente
- [ ] Seleccioné BD: `rutas_buses`
- [ ] Ejecuté el SQL del archivo `UPDATE_BD_RECOVERY.sql`
- [ ] Vi el mensaje de éxito ✅
- [ ] Verifiqué que existan 3 columnas nuevas
- [ ] Probé recuperación de contraseña (opcional)

---

## 🎯 PRÓXIMO PASO

Una vez completado esto:

1. Compañero te avisa que finalizó ✅
2. Ya puedes probar el flujo completo de recuperación de contraseña
3. Sistema estará listo para producción 🚀

---

## 📞 DUDAS O PROBLEMAS

Si hay error, adjunta:
- Screenshot del error
- Línea exacta del mensaje
- Pasos que ejecutaste

Y lo resolvemos rápido 👍

---

**Documento preparado por**: GitHub Copilot  
**Para implementación en**: Base de datos `rutas_buses`  
**Fecha**: 22 de marzo de 2026

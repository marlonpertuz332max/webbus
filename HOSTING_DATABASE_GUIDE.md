# Guía de Hosting y Base de Datos para WebBus

Este proyecto ha sido configurado para ejecutarse fácilmente usando **Docker** para hosting local y está preparado para despliegue en la nube (**Railway** o **Render**).

## 1. Hosting Local con Docker (Recomendado)

Hemos creado un archivo `docker-compose.yml` que configura automáticamente todo lo necesario:
- **Servidor Web**: PHP 8.1 con Apache.
- **Base de Datos**: MySQL 8.0.
- **Inicialización Automática**: La base de datos se crea y se llena con los datos de `database/` al iniciar por primera vez.

### Requisitos
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Cómo iniciar
1. Abre una terminal en la raíz del proyecto.
2. Ejecuta el siguiente comando:
   ```bash
   docker-compose up -d --build
   ```
3. La aplicación estará disponible en: [http://localhost:8080](http://localhost:8080)
4. La base de datos MySQL estará accesible en `localhost:3306` con:
   - **Usuario**: `user`
   - **Contraseña**: `user_password`
   - **Base de datos**: `rutas_buses`

---

## 2. Hosting en la Nube (Producción)

La aplicación está lista para ser desplegada en plataformas como **Railway** o **Render**.

### Opción A: Railway (Muy fácil)
1. Crea una cuenta en [Railway.app](https://railway.app/).
2. Conecta tu repositorio de GitHub.
3. Railway detectará automáticamente el `Dockerfile` y el `docker-compose.yml`.
4. Agrega una base de datos MySQL en Railway.
5. Configura las siguientes variables de entorno en el servicio web:
   - `DB_HOST`: El host de tu base de datos MySQL en Railway.
   - `DB_USER`: Tu usuario de base de datos.
   - `DB_PASS`: Tu contraseña de base de datos.
   - `DB_NAME`: `rutas_buses`
   - `DB_PORT`: `3306`

### Opción B: Render
1. Crea una cuenta en [Render.com](https://render.com/).
2. Crea un nuevo "Web Service" y conecta tu repositorio.
3. Crea una "MySQL Database" (o usa el Add-on de MySQL).
4. Render detectará el `Dockerfile`.
5. En la sección "Environment", agrega la variable:
   - `MYSQL_URL`: La URL de conexión que te da Render (ej: `mysql://user:pass@host:port/db`).
   - El archivo `config/config.php` está preparado para leer esta variable automáticamente.

---

## 3. Estructura de la Base de Datos
Los archivos de inicialización se encuentran en:
- `database/01_rutas_buses.sql`: Estructura principal y datos iniciales.
- `database/02_UPDATE_BD_RECOVERY.sql`: Columnas necesarias para el sistema de recuperación de contraseña.

---

¡Listo! Con esto tienes un entorno de hosting completo y una base de datos funcional.

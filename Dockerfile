# Dockerfile de alto rendimiento para Railway
FROM php:8.1-fpm-alpine

# Instalar extensiones necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Instalar Nginx
RUN apk add --no-cache nginx

# Configurar logs para ver errores reales en la consola de Railway
RUN echo "display_errors = Off" > /usr/local/etc/php/conf.d/docker-php-logging.ini && \
    echo "log_errors = On" >> /usr/local/etc/php/conf.d/docker-php-logging.ini && \
    echo "error_log = /dev/stderr" >> /usr/local/etc/php/conf.d/docker-php-logging.ini && \
    echo "variables_order = EGPCS" >> /usr/local/etc/php/conf.d/docker-php-logging.ini

# CRÍTICO: PHP-FPM borra todas las variables de entorno por defecto (clear_env = yes)
# Sin esto, getenv('MYSQL_URL') devuelve vacío y la conexión falla
RUN echo "clear_env = no" >> /usr/local/etc/php-fpm.d/www.conf

# Configuración de Nginx Optimizada
# Crear script de arranque que genera la config de Nginx con las variables de entorno
RUN cat > /start.sh << 'STARTSCRIPT'
#!/bin/sh

# Generar configuración de Nginx con variables de entorno inyectadas
cat > /etc/nginx/http.d/default.conf << NGINXEOF
server {
    listen 80;
    root /var/www/html;
    index iniciowebbus/index.html index.php;
    location = / {
        return 301 /iniciowebbus/index.html;
    }
    location = /index.html {
        return 301 /iniciowebbus/index.html;
    }
    location / {
        try_files \$uri \$uri/ =404;
    }
    location ~ \.php\$ {
        try_files \$uri =404;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param MYSQL_URL "${MYSQL_URL}";
        fastcgi_param MYSQLHOST "${MYSQLHOST}";
        fastcgi_param MYSQLUSER "${MYSQLUSER}";
        fastcgi_param MYSQLPASSWORD "${MYSQLPASSWORD}";
        fastcgi_param MYSQLDATABASE "${MYSQLDATABASE}";
        fastcgi_param MYSQLPORT "${MYSQLPORT}";
        fastcgi_param DATABASE_URL "${DATABASE_URL}";
    }
}
NGINXEOF

# Iniciar PHP-FPM y Nginx
php-fpm -D
nginx -g 'daemon off;'
STARTSCRIPT
RUN chmod +x /start.sh

# COPIA ESTRATÉGICA:
# Copiamos el CONTENIDO de WebBus a la raíz para que ../config funcione
COPY WebBus/ /var/www/html/
COPY config/ /var/www/html/config/
COPY database/ /var/www/html/database/

# Permisos correctos para Nginx
RUN chmod -R 755 /var/www/html && chown -R nginx:nginx /var/www/html

EXPOSE 80

CMD ["/start.sh"]

<?php
// ============================================
// CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS (SUPER ROBUSTA)
// ============================================

ini_set('display_errors', 0);
error_reporting(E_ALL);

// Función helper para obtener variable de entorno de CUALQUIER fuente
// En Railway con Docker (Nginx + PHP-FPM), las variables llegan via:
// 1. $_SERVER (desde fastcgi_param de Nginx)
// 2. $_ENV (si variables_order incluye E)
// 3. getenv() (desde el proceso PHP-FPM si clear_env=no)
function env_get($name) {
    // Primero: $_SERVER (más confiable con Nginx fastcgi_param)
    if (isset($_SERVER[$name]) && $_SERVER[$name] !== '') {
        return $_SERVER[$name];
    }
    // Segundo: $_ENV
    if (isset($_ENV[$name]) && $_ENV[$name] !== '') {
        return $_ENV[$name];
    }
    // Tercero: getenv()
    $val = getenv($name);
    if ($val !== false && $val !== '') {
        return $val;
    }
    return false;
}

// Obtener la URL maestra de Railway (busca todos los nombres posibles)
$mysqlUrl = env_get('MYSQL_URL') ?: env_get('DATABASE_URL') ?: env_get('URL_MYSQL');

if ($mysqlUrl) {
    $parts = parse_url($mysqlUrl);
    $host = $parts['host'] ?? 'localhost';
    $usuario = $parts['user'] ?? 'root';
    $password = $parts['pass'] ?? '';
    $base_datos = ltrim($parts['path'] ?? '/railway', '/');
    $port = $parts['port'] ?? 3306;
} else {
    // Fallback para variables individuales
    $host = env_get('MYSQLHOST') ?: 'localhost';
    $usuario = env_get('MYSQLUSER') ?: 'root';
    $password = env_get('MYSQLPASSWORD') ?: '';
    $base_datos = env_get('MYSQLDATABASE') ?: 'railway';
    $port = (int)(env_get('MYSQLPORT') ?: 3306);
}

try {
    mysqli_report(MYSQLI_REPORT_STRICT | MYSQLI_REPORT_ERROR);
    $conexion = new mysqli($host, $usuario, $password, $base_datos, $port);
    $conexion->set_charset("utf8mb4");
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "error" => "Fallo de conexión a la base de datos",
        "debug" => $e->getMessage(),
        "host" => $host ?? 'no definido',
        "port" => $port ?? 'no definido',
        "database" => $base_datos ?? 'no definido',
        "mysql_url_found" => !empty($mysqlUrl),
        "env_check" => [
            "MYSQL_URL_server" => isset($_SERVER['MYSQL_URL']) ? 'set' : 'not set',
            "MYSQL_URL_getenv" => getenv('MYSQL_URL') !== false ? 'set' : 'not set',
            "MYSQLHOST_server" => isset($_SERVER['MYSQLHOST']) ? 'set' : 'not set',
            "MYSQLHOST_getenv" => getenv('MYSQLHOST') !== false ? 'set' : 'not set',
        ]
    ]);
    exit;
}
?>

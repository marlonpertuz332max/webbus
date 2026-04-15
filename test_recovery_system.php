<?php
// ============================================================
// TEST SIMULADO DEL FLUJO COMPLETO
// ============================================================

echo "<pre style='font-family: monospace; background: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px;'>\n\n";

echo "=== TEST DE RECUPERACIÓN DE CONTRASEÑA ===\n\n";

// 1. Verificar estructura de directorios
echo "1️⃣ VERIFICANDO ESTRUCTURA DE DIRECTORIOS:\n";
$dirs_to_check = [
    'config/config.php' => 'Configuración de BD',
    'logs/' => 'Carpeta de logs',
    'WebBus/api/request-password-recovery.php' => 'API: Generar token',
    'WebBus/api/send-password-recovery-email.php' => 'API: Enviar email',
    'WebBus/recuperarContraseña/recuperarContraseña.html' => 'Formulario de recuperación',
];

foreach ($dirs_to_check as $path => $desc) {
    $full_path = __DIR__ . '/' . $path;
    if (file_exists($full_path)) {
        echo "   ✅ " . $desc . " → " . $path . "\n";
    } else {
        echo "   ❌ " . $desc . " → NO ENCONTRADO\n";
    }
}

// 2. Verificar permisos de directorios
echo "\n2️⃣ VERIFICANDO PERMISOS:\n";
$logs_dir = __DIR__ . '/logs';
if (is_writable($logs_dir)) {
    echo "   ✅ Carpeta /logs/ tiene permisos de escritura\n";
} else {
    echo "   ⚠️ Carpeta /logs/ podría no tener permisos suficientes\n";
}

// 3. Verificar BD
echo "\n3️⃣ VERIFICANDO CONEXIÓN A BASE DE DATOS:\n";
include 'config/config.php';

try {
    // Verificar que la conexión está OK
    if ($conexion->connect_error) {
        echo "   ❌ Error de conexión: " . $conexion->connect_error . "\n";
    } else {
        echo "   ✅ Conexión a BD exitosa (rutas_buses)\n";
        
        // Verificar columnas de recuperación
        $result = $conexion->query("SHOW COLUMNS FROM usuarios LIKE 'recovery_%'");
        if ($result && $result->num_rows >= 3) {
            echo "   ✅ Columnas de recuperación están presentes\n";
        } else {
            echo "   ❌ Columnas de recuperación NO ENCONTRADAS\n";
            echo "      Ejecuta: UPDATE_BD_RECOVERY.sql\n";
        }
    }
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

// 4. Simulación del flujo
echo "\n4️⃣ SIMULACIÓN DEL FLUJO COMPLETO:\n";

// Simular solicitud de recuperación
$test_email = "admin@buses.com";
echo "   📧 Email a recuperar: $test_email\n";

// Generar token simulado
$token = bin2hex(random_bytes(32));
$expiry = date('Y-m-d H:i:s', time() + 1800); // 30 minutos
echo "   🔐 Token generado: " . substr($token, 0, 20) . "...\n";
echo "   ⏰ Expira en: $expiry\n";

// Generar enlace simulado
$link = "http://localhost/WebBusapp/WebBus/restablecerContraseña/?token=" . $token;
echo "   🔗 Enlace: $link\n";

// Simular escritura en log
echo "\n5️⃣ PROBANDO ESCRITURA EN LOG:\n";
$log_file = $logs_dir . '/recovery_emails_' . date('Y-m-d') . '.log';
$log_entry = "\n=====================================\n";
$log_entry .= "FECHA: " . date('Y-m-d H:i:s') . "\n";
$log_entry .= "PARA: $test_email\n";
$log_entry .= "ASUNTO: WebBus - Recuperación de Contraseña\n";
$log_entry .= "NOMBRE: Test User\n";
$log_entry .= "ENLACE: $link\n";
$log_entry .= "CONTENIDO: Test Email HTML\n";
$log_entry .= "=====================================\n";

if (file_put_contents($log_file, $log_entry, FILE_APPEND)) {
    echo "   ✅ Log escrito exitosamente\n";
    echo "   📄 Archivo: $log_file\n";
} else {
    echo "   ❌ Error al escribir log\n";
}

// 6. URLs importantes
echo "\n6️⃣ ACCESOS PARA TESTING:\n";
echo "   🌐 Formulario de recuperación:\n";
echo "      http://localhost/WebBusapp/WebBus/recuperarContraseña/recuperarContraseña.html\n";
echo "\n   📋 Panel de logs (Ver enlaces generados):\n";
echo "      http://localhost/WebBusapp/recovery_logs_viewer.php\n";
echo "\n   📚 Documentación:\n";
echo "      http://localhost/WebBusapp/GUIA_RECUPERACION_DESARROLLO.md\n";

echo "\n=== TEST COMPLETADO ===\n\n";
echo "</pre>\n";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test - Sistema de Recuperación</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ Sistema de Recuperación de Contraseña - Verificación Completa</h1>
        <p>Si todos los checks pasaron, el sistema está listo para usar.</p>
        <hr>
    </div>
</body>
</html>

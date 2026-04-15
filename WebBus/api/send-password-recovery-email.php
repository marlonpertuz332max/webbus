<?php
// ============================================================
// ENDPOINT: Enviar Email de Recuperación de Contraseña
// ============================================================

// Configurar errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

try {
    // Incluir configuración
    require_once '../config/config.php';
    
    $input = json_decode(file_get_contents("php://input"), true);
    
    $nombre = isset($input['nombre']) ? trim($input['nombre']) : '';
    $correo = isset($input['correo']) ? trim($input['correo']) : '';
    $link_recuperacion = isset($input['link_recuperacion']) ? trim($input['link_recuperacion']) : '';
    $fecha = isset($input['fecha']) ? trim($input['fecha']) : date('d/m/Y H:i');
    
    if (!$nombre || !$correo || !$link_recuperacion) {
        throw new Exception('Datos incompletos');
    }
    
    // Crear carpeta de logs si no existe
    $logs_dir = '../../logs';
    if (!is_dir($logs_dir)) {
        mkdir($logs_dir, 0777, true);
    }
    
    // Preparar contenido del correo
    $html = "<html><body style='font-family: Arial, sans-serif;'>";
    $html .= "<div style='max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;'>";
    $html .= "<h2 style='color: #667eea; text-align: center;'>WebBus - Recuperación de Contraseña</h2>";
    $html .= "<p>¡Hola <strong>" . htmlspecialchars($nombre) . "</strong>!</p>";
    $html .= "<p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo:</p>";
    $html .= "<p style='margin: 20px 0; text-align: center;'>";
    $html .= "<a href='" . htmlspecialchars($link_recuperacion) . "' style='display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Restablecer Contraseña</a>";
    $html .= "</p>";
    $html .= "<p>O copia y pega este enlace:</p>";
    $html .= "<p style='background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;'>" . htmlspecialchars($link_recuperacion) . "</p>";
    $html .= "<div style='background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0;'>";
    $html .= "<strong>⚠️ IMPORTANTE:</strong><br>";
    $html .= "• Este enlace expirará en 30 minutos<br>";
    $html .= "• Si no solicitaste esto, ignora este correo<br>";
    $html .= "• No compartas este enlace con nadie";
    $html .= "</div>";
    $html .= "<p style='color: #666; font-size: 12px;'>Solicitado: " . htmlspecialchars($fecha) . "</p>";
    $html .= "<hr>";
    $html .= "<p style='color: #999; font-size: 11px; text-align: center;'>© 2026 Web Bus</p>";
    $html .= "</div>";
    $html .= "</body></html>";
    
    // Guardar en log de desarrollo (mientras se configuran credenciales SMTP reales)
    $log_file = $logs_dir . '/recovery_emails_' . date('Y-m-d') . '.log';
    $log_entry = "\n=====================================\n";
    $log_entry .= "FECHA: " . date('Y-m-d H:i:s') . "\n";
    $log_entry .= "PARA: {$correo}\n";
    $log_entry .= "ASUNTO: WebBus - Recuperación de Contraseña\n";
    $log_entry .= "NOMBRE: {$nombre}\n";
    $log_entry .= "ENLACE: {$link_recuperacion}\n";
    $log_entry .= "CONTENIDO:\n{$html}\n";
    $log_entry .= "=====================================\n";
    
    if (!file_put_contents($log_file, $log_entry, FILE_APPEND)) {
        throw new Exception('No se pudo guardar en log de recuperación');
    }
    
    // En desarrollo/testing: también intentar enviar por mail() como fallback
    $intentar_mail = false;
    if ($intentar_mail) {
        $asunto = "WebBus - Recuperación de Contraseña";
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: WebBus <noreply@webbus.local>\r\n";
        @mail($correo, $asunto, $html, $headers);
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Enlace generado correctamente. En desarrollo: revisar ' . $log_file,
        'debug_log_path' => $log_file
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    $error_msg = $e->getMessage();
    error_log('Error al enviar correo: ' . $error_msg);
    
    echo json_encode([
        'success' => false,
        'error' => $error_msg
    ]);
}

?>

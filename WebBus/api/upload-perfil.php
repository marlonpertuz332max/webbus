<?php
// Evitar que errores previos rompan JSON
ob_start();

// === CORS HEADERS ===
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejo de preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

try {
    // Buscar configuración de DB
    $configPath = dirname(__DIR__, 2) . '/config/config.php';
    if (!file_exists($configPath)) {
        $configPath = dirname(__DIR__) . '/config/config.php';
    }
    if (!file_exists($configPath)) {
        $configPath = '../../config/config.php';
    }
    require_once $configPath;

    // Limpiar buffers
    if (ob_get_length()) ob_clean();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido. Usa POST.');
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $id_usuario = isset($data['id_usuario']) ? intval($data['id_usuario']) : 0;
    $foto_base64 = $data['foto_perfil'] ?? '';

    if ($id_usuario <= 0 || empty($foto_base64)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios o imagen vacía.']);
        exit;
    }

    // Validar formato Base64 básico para seguridad y tamaño (opcional)
    // El frontend ya debería mandarlo optimizado como data:image/jpeg;base64,...

    $stmt = $conexion->prepare("UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?");
    $stmt->bind_param("si", $foto_base64, $id_usuario);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Foto de perfil actualizada exitosamente.']);
    } else {
        throw new Exception('Error al actualizar la base de datos: ' . $stmt->error);
    }

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

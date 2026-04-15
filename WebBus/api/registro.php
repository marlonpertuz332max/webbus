<?php
// Evitar que cualquier error previo rompa el JSON
ob_start();

// === CORS HEADERS (necesario para Railway y cualquier hosting con dominio diferente) ===
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// === MANEJO DE PREFLIGHT OPTIONS ===
// El navegador envía primero un request OPTIONS antes del POST real.
// Si no respondemos correctamente aquí, el fetch recibe body vacío → "Unexpected end of JSON input"
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

// Ruta robusta para encontrar la configuración (compatible con Docker en Railway)
$configPath = dirname(__DIR__, 2) . '/config/config.php';
if (!file_exists($configPath)) {
    // En el contenedor Docker, la estructura es /var/www/html/api/ y /var/www/html/config/
    $configPath = dirname(__DIR__) . '/config/config.php';
}
if (!file_exists($configPath)) {
    // Fallback absoluto
    $configPath = '../../config/config.php';
}

try {
    require_once $configPath;
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo cargar la configuración', 'debug' => $configPath]);
    exit;
}

// Limpiar cualquier salida accidental (warnings, etc)
ob_clean();

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    $nombre = trim($data['nombre'] ?? '');
    $correo = trim($data['correo'] ?? '');
    $password = trim($data['password'] ?? '');
    $confirmar_password = trim($data['confirmar_password'] ?? '');
    
    // Validaciones
    if (empty($nombre) || empty($correo) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son requeridos']);
        exit;
    }
    
    if ($password !== $confirmar_password) {
        http_response_code(400);
        echo json_encode(['error' => 'Las contraseñas no coinciden']);
        exit;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
        exit;
    }
    
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Correo electrónico no válido']);
        exit;
    }
    
    // Verificar si el correo ya existe
    $stmt = $conexion->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'El correo ya está registrado']);
        $stmt->close();
        exit;
    }
    
    // Hash de la contraseña
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
    // Insertar nuevo usuario
    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, correo, password, tipo_usuario) VALUES (?, ?, ?, 'usuario')");
    $stmt->bind_param("sss", $nombre, $correo, $password_hash);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'mensaje' => 'Usuario registrado exitosamente',
            'id_usuario' => $stmt->insert_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al registrar usuario: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conexion->close();
?>

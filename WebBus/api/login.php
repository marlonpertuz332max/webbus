<?php
// Evitar que cualquier error previo rompa el JSON
ob_start();
session_start(); // Iniciar sesión para rate limiting

// === CORS HEADERS ===
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// === MANEJO DE PREFLIGHT OPTIONS ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

// === RATE LIMITING (Máximo 5 intentos fallidos en 15 minutos) ===
$max_intentos = 5;
$tiempo_bloqueo = 15 * 60; // 15 minutos en segundos

if (isset($_SESSION['login_attempts']) && $_SESSION['login_attempts'] >= $max_intentos) {
    $tiempo_transcurrido = time() - $_SESSION['last_attempt_time'];
    if ($tiempo_transcurrido < $tiempo_bloqueo) {
        $minutos_restantes = ceil(($tiempo_bloqueo - $tiempo_transcurrido) / 60);
        http_response_code(429); // Too Many Requests
        echo json_encode(['error' => "Demasiados intentos fallidos. Intenta de nuevo en $minutos_restantes minutos."]);
        ob_end_flush();
        exit;
    } else {
        // Resetear intentos si ya pasó el tiempo de bloqueo
        $_SESSION['login_attempts'] = 0;
    }
}

try {
    // Ruta robusta para encontrar la configuración (compatible con Docker en Railway)
    $configPath = dirname(__DIR__, 2) . '/config/config.php';
    if (!file_exists($configPath)) {
        $configPath = dirname(__DIR__) . '/config/config.php';
    }
    if (!file_exists($configPath)) {
        $configPath = '../../config/config.php';
    }
    require_once $configPath;

    // Limpiar cualquier salida accidental (warnings, etc)
    if (ob_get_length()) ob_clean();

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            $data = $_POST;
        }
        
        $correo = trim($data['correo'] ?? '');
        $password = trim($data['password'] ?? '');
        
        if (empty($correo) || empty($password)) {
            registrarErrorLogin();
            throw new Exception('Correo y contraseña son requeridos');
        }
        
        // Buscar usuario por correo
        $stmt = $conexion->prepare("SELECT id_usuario, nombre, correo, password, foto_perfil FROM usuarios WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            registrarErrorLogin();
            http_response_code(401);
            echo json_encode(['error' => 'Correo o contraseña incorrectos']);
            exit;
        }
        
        $usuario = $result->fetch_assoc();
        
        // Verificar contraseña
        if (!password_verify($password, $usuario['password'])) {
            registrarErrorLogin();
            http_response_code(401);
            echo json_encode(['error' => 'Correo o contraseña incorrectos']);
            exit;
        }
        
        // Login exitoso
        $_SESSION['login_attempts'] = 0; // Resetear intentos al tener éxito
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso',
            'usuario' => [
                'id' => $usuario['id_usuario'],
                'nombre' => $usuario['nombre'],
                'correo' => $usuario['correo'],
                'foto_perfil' => $usuario['foto_perfil']
            ]
        ]);
    } else {
        throw new Exception('Método no permitido');
    }

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => 'Error en login.php'
    ]);
}

// Función auxiliar para registrar intentos fallidos
function registrarErrorLogin() {
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = 0;
    }
    $_SESSION['login_attempts']++;
    $_SESSION['last_attempt_time'] = time();
}
?>

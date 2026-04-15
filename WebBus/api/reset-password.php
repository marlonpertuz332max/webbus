<?php
// ============================================================
// ENDPOINT: Restablecer contraseña
// Valida token, verifica expiración y actualiza contraseña
// ============================================================

header('Content-Type: application/json; charset=utf-8');

require_once '../config/config.php';

// Obtener datos enviados
$input = json_decode(file_get_contents('php://input'), true);
$recovery_token = isset($input['token']) ? trim($input['token']) : '';
$new_password = isset($input['password']) ? trim($input['password']) : '';

// Validar que ambos campos existan
if (empty($recovery_token) || empty($new_password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Token y contraseña requeridos'
    ]);
    exit;
}

// Validar longitud mínima de contraseña
if (strlen($new_password) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'La contraseña debe tener mínimo 6 caracteres'
    ]);
    exit;
}

// Buscar usuario con ese token
$sql = "SELECT id_usuario, correo, recovery_token_expiry, token_used 
        FROM usuarios 
        WHERE recovery_token = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error en consulta']);
    exit;
}

$stmt->bind_param("s", $recovery_token);
$stmt->execute();
$resultado = $stmt->get_result();

// Token no existe
if ($resultado->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => 'Token de recuperación inválido o expirado'
    ]);
    exit;
}

$usuario = $resultado->fetch_assoc();
$id_usuario = $usuario['id_usuario'];
$correo = $usuario['correo'];
$token_expiry = $usuario['recovery_token_expiry'];
$token_used = $usuario['token_used'];

// Verificar si el token ya fue usado
if ($token_used) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Este enlace de recuperación ya fue utilizado. Solicita uno nuevo.'
    ]);
    exit;
}

// Verificar si el token ha expirado (30 minutos)
$fecha_expiry = new DateTime($token_expiry);
$fecha_ahora = new DateTime();

if ($fecha_ahora > $fecha_expiry) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'El enlace de recuperación ha expirado. Solicita uno nuevo.'
    ]);
    exit;
}

// ✅ Token válido - Hashear y actualizar contraseña
$password_hasheada = password_hash($new_password, PASSWORD_BCRYPT);

$sql_update = "UPDATE usuarios 
               SET password = ?,
                   recovery_token = NULL,
                   recovery_token_expiry = NULL,
                   token_used = TRUE
               WHERE id_usuario = ?";

$stmt_update = $conexion->prepare($sql_update);

if (!$stmt_update) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al actualizar contraseña']);
    exit;
}

$stmt_update->bind_param("si", $password_hasheada, $id_usuario);

if (!$stmt_update->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al guardar contraseña']);
    exit;
}

// ✅ Contraseña restablecida exitosamente
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.',
    'correo' => $correo
]);

$stmt->close();
$stmt_update->close();
$conexion->close();

?>

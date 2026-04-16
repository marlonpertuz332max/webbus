<?php
// ============================================================
// ENDPOINT: Solicitar recuperación de contraseña
// Genera un token del SERVIDOR y lo guarda en BD
// ============================================================

header('Content-Type: application/json; charset=utf-8');

require_once '../config/config.php';

// Obtener datos enviados
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';

// Validar email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido', 'success' => false]);
    exit;
}

// Verificar que el correo existe en BD
$sql = "SELECT id_usuario, nombre FROM usuarios WHERE correo = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en consulta', 'success' => false]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    // No revelamos si el email existe (seguridad)
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Si el correo existe, recibirás un enlace de recuperación'
    ]);
    exit;
}

$fila = $resultado->fetch_assoc();
$id_usuario = $fila['id_usuario'];
$nombre = $fila['nombre'];

// Generar token SEGURO del servidor
$recovery_token = bin2hex(random_bytes(32)); // token de 64 caracteres
$expiry_time = date('Y-m-d H:i:s', strtotime('+30 minutes')); // Válido por 30 minutos

// Guardar token en BD
$sql_update = "UPDATE usuarios 
               SET recovery_token = ?, 
                   recovery_token_expiry = ?,
                   token_used = FALSE
               WHERE id_usuario = ?";

$stmt_update = $conexion->prepare($sql_update);

if (!$stmt_update) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar token', 'success' => false]);
    exit;
}

$stmt_update->bind_param("ssi", $recovery_token, $expiry_time, $id_usuario);

if (!$stmt_update->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar token en BD', 'success' => false]);
    exit;
}

// ✅ Token guardado correctamente
// Construir URL de recuperación
$base_url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
$recovery_url = $base_url . "/restablecerContraseña/restablecerContraseña.html?token=" . $recovery_token;

// Preparar datos para EmailJS
$fecha_actual = date('d de F de Y H:i', strtotime('now'));

$respuesta = [
    'success' => true,
    'message' => 'Token generado correctamente',
    'emailData' => [
        'nombre' => $nombre,
        'correo' => $email,
        'fecha' => $fecha_actual,
        'link_recuperacion' => $recovery_url,
        'recovery_token' => $recovery_token
    ]
];

http_response_code(200);
echo json_encode($respuesta);

$stmt->close();
$stmt_update->close();
$conexion->close();

?>

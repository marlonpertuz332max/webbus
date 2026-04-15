<?php
// ============================================
// ENDPOINT: Verificar si correo está registrado
// ============================================

header('Content-Type: application/json; charset=utf-8');

require_once '../config/config.php';

// Obtener los datos enviados
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';

// Validar que el email no esté vacío
if (empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email requerido', 'exists' => false]);
    exit;
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido', 'exists' => false]);
    exit;
}

// Consultar en la BD
$sql = "SELECT id_usuario FROM usuarios WHERE correo = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta: ' . $conexion->error, 'exists' => false]);
    exit;
}

// Bindear parámetro
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

// Verificar si existe
$existe = $resultado->num_rows > 0;

// Retornar respuesta
http_response_code($existe ? 200 : 404);
echo json_encode([
    'exists' => $existe,
    'email' => $email,
    'message' => $existe ? 'Email registrado' : 'Email no registrado'
]);

$stmt->close();
$conexion->close();

?>

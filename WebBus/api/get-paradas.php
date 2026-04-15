<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/config.php';

$sql = "SELECT id_parada, nombre_parada, latitud, longitud FROM paradas ORDER BY id_parada ASC";
$result = $conexion->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $conexion->error]);
    exit;
}

$paradas = [];
while ($row = $result->fetch_assoc()) {
    $paradas[] = $row;
}

echo json_encode([
    'success' => true,
    'total' => count($paradas),
    'paradas' => $paradas
]);

$conexion->close();
?>

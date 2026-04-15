<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/config.php';

$sql = "SELECT id_bus, numero_bus, placa, capacidad FROM buses ORDER BY id_bus ASC";
$result = $conexion->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $conexion->error]);
    exit;
}

$buses = [];
while ($row = $result->fetch_assoc()) {
    $buses[] = $row;
}

echo json_encode([
    'success' => true,
    'total' => count($buses),
    'buses' => $buses
]);

$conexion->close();
?>

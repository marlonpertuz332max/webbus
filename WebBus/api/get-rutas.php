<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/config.php';

$sql = "SELECT id_ruta, nombre_ruta, origen, destino, distancia_km FROM rutas ORDER BY id_ruta ASC";
$result = $conexion->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $conexion->error]);
    exit;
}

$rutas = [];
while ($row = $result->fetch_assoc()) {
    $rutas[] = $row;
}

echo json_encode([
    'success' => true,
    'total' => count($rutas),
    'rutas' => $rutas
]);

$conexion->close();
?>

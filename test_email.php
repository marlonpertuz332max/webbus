<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== TEST DE EMAIL ===\n\n";

echo "1. Verificando configuración PHP:\n";
echo "SMTP: " . ini_get('SMTP') . "\n";
echo "smtp_port: " . ini_get('smtp_port') . "\n";
echo "sendmail_from: " . ini_get('sendmail_from') . "\n";
echo "sendmail_path: " . ini_get('sendmail_path') . "\n\n";

echo "2. Intentando enviar email...\n";

$to = "Marlonpertuz332@gmail.com";
$subject = "Test WebBus Email";
$message = "Esto es un test";
$headers = "From: test@webbus.local\r\nContent-Type: text/html; charset=UTF-8";

$result = @mail($to, $subject, $message, $headers);

echo "Resultado de mail(): " . ($result ? "TRUE" : "FALSE") . "\n";
echo "Errno: " . is_callable('error_get_last') ? json_encode(error_get_last()) : "N/A" . "\n";

echo "\n3. Verificando si localhost:25 está disponible:\n";
$fp = @fsockopen('localhost', 25, $errno, $errstr, 5);
if ($fp) {
    echo "Puerto 25 ABIERTO\n";
    fclose($fp);
} else {
    echo "Puerto 25 CERRADO - Error: " . $errstr . "\n";
}

echo "\n4. Verificando localhost:587 (TLS):\n";
$fp = @fsockopen('localhost', 587, $errno, $errstr, 5);
if ($fp) {
    echo "Puerto 587 ABIERTO\n";
    fclose($fp);
} else {
    echo "Puerto 587 CERRADO - Error: " . $errstr . "\n";
}

echo "\n=== FIN TEST ===";
?>

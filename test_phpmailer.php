<?php
// Test PHPMailer con Mailtrap

// Incluir PHPMailer  
require_once 'C:\xampp\htdocs\WebBusapp\PHPMailer-master\src\PHPMailer.php';
require_once 'C:\xampp\htdocs\WebBusapp\PHPMailer-master\src\SMTP.php';
require_once 'C:\xampp\htdocs\WebBusapp\PHPMailer-master\src\Exception.php';

echo "=== TEST PHPMAILER + MAILTRAP ===\n\n";

try {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    
    echo "1. Configurando SMTP Mailtrap...\n";
    $mail->isSMTP();
    $mail->Host = 'smtp.mailtrap.io';
    $mail->Port = 2525;
    $mail->SMTPAuth = true;
    $mail->Username = '53e9d7d1949dd1';
    $mail->Password = '64a22c6d6cfc99';
    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    echo "   ✓ SMTP configurado\n\n";
    
    echo "2. Configurando mensaje...\n";
    $mail->setFrom('noreply@webbus.local', 'WebBus Test');
    $mail->addAddress('Marlonpertuz332@gmail.com', 'Marlon Perez');
    $mail->Subject = 'Test WebBus - PHPMailer + Mailtrap';
    $mail->Body = 'Este es un correo de prueba desde PHPMailer con Mailtrap';
    $mail->isHTML(false);
    echo "   ✓ Mensaje configurado\n\n";
    
    echo "3. Intentando enviar...\n";
    if ($mail->send()) {
        echo "   ✓ CORREO ENVIADO EXITOSAMENTE\n";
    } else {
        echo "   ✗ Error: " . $mail->ErrorInfo . "\n";
    }
    
} catch (Exception $e) {
    echo "✗ EXCEPCIÓN: " . $e->getMessage() . "\n";
}

echo "\n=== FIN TEST ===";
?>

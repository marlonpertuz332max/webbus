<?php
// ============================================================
// Viewer de Logs de Recuperación de Contraseña (DEVELOPMENT)
// ============================================================

$logs_dir = '../logs';

if (!is_dir($logs_dir)) {
    die('Carpeta de logs no encontrada');
}

// Obtener archivo del día actual
$today_log = $logs_dir . '/recovery_emails_' . date('Y-m-d') . '.log';

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebBus - Recovery Email Logs (Development)</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin-bottom: 10px;
            font-size: 28px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .alert {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            color: #856404;
        }
        .email-entry {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .email-entry .meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .email-entry .meta-item {
            display: flex;
            flex-direction: column;
        }
        .email-entry .meta-label {
            font-weight: bold;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
        }
        .email-entry .meta-value {
            color: #333;
        }
        .email-entry .link-button {
            background: #667eea;
            color: white;
            padding: 8px 15px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin-top: 10px;
            font-size: 12px;
            word-break: break-all;
            max-width: 100%;
            font-family: monospace;
        }
        .email-entry .link-button:hover {
            background: #764ba2;
        }
        .empty {
            text-align: center;
            color: #999;
            padding: 40px 20px;
        }
        .empty svg {
            width: 60px;
            height: 60px;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        .footer {
            background: #f8f9fa;
            padding: 15px 30px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 WebBus - Recovery Email Logs</h1>
            <p>Panel de Desarrollo - Correos de Recuperación</p>
        </div>
        
        <div class="content">
            <div class="alert">
                <strong>📌 Nota DEV:</strong> Este es un panel de desarrollo para ver los enlaces de recuperación de contraseña. 
                En producción, estos correos deberían enviarse via SMTP a las direcciones reales.
            </div>
            
            <?php
            if (file_exists($today_log)) {
                $content = file_get_contents($today_log);
                $entries = array_filter(explode('=====================================', $content));
                
                if (!empty($entries)) {
                    foreach ($entries as $entry) {
                        $entry = trim($entry);
                        if (empty($entry)) continue;
                        
                        // Parsear entrada
                        preg_match('/FECHA:\s(.+)/i', $entry, $date_match);
                        preg_match('/PARA:\s(.+)/i', $entry, $email_match);
                        preg_match('/NOMBRE:\s(.+)/i', $entry, $name_match);
                        preg_match('/ENLACE:\s(.+)/i', $entry, $link_match);
                        
                        $fecha = isset($date_match[1]) ? trim($date_match[1]) : 'N/A';
                        $email = isset($email_match[1]) ? trim($email_match[1]) : 'N/A';
                        $nombre = isset($name_match[1]) ? trim($name_match[1]) : 'N/A';
                        $enlace = isset($link_match[1]) ? trim($link_match[1]) : '#';
                        
                        echo '<div class="email-entry">';
                        echo '<div class="meta">';
                        echo '<div class="meta-item">';
                        echo '<span class="meta-label">Fecha</span>';
                        echo '<span class="meta-value">' . htmlspecialchars($fecha) . '</span>';
                        echo '</div>';
                        echo '<div class="meta-item">';
                        echo '<span class="meta-label">Para</span>';
                        echo '<span class="meta-value">' . htmlspecialchars($email) . '</span>';
                        echo '</div>';
                        echo '<div class="meta-item">';
                        echo '<span class="meta-label">Nombre</span>';
                        echo '<span class="meta-value">' . htmlspecialchars($nombre) . '</span>';
                        echo '</div>';
                        echo '</div>';
                        echo '<span class="meta-label" style="display: block; margin-top: 10px;">Enlace de Recuperación</span>';
                        echo '<a href="' . htmlspecialchars($enlace) . '" class="link-button" target="_blank">';
                        echo htmlspecialchars($enlace);
                        echo '</a>';
                        echo '</div>';
                    }
                } else {
                    echo '<div class="empty"><p>No hay solicitudes de recuperación hoy</p></div>';
                }
            } else {
                echo '<div class="empty"><p>📧 Aún no hay solicitudes de recuperación. Cuando un usuario solicite recuperar su contraseña,aparecerá un registro aquí.</p></div>';
            }
            ?>
        </div>
        
        <div class="footer">
            <strong>Ver logs de otros días:</strong>
            <br><small style="color: #999; margin-top: 5px;">
                Los archivos de log se guardan en: <code>logs/recovery_emails_YYYY-MM-DD.log</code>
            </small>
        </div>
    </div>
</body>
</html>

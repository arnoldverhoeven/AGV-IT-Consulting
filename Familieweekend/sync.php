<?php
// Mini-sync voor de familieweekend-pagina.
// Zet dit bestand naast index.html. Het bewaart alles in weekend-data.json (zelfde map).
// Vereist: PHP 7+ en schrijfrechten op de map (chmod 755/775 volstaat meestal).

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$file = __DIR__ . '/weekend-data.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    if (!is_array($data) || strlen($body) > 500000) {
        http_response_code(400);
        echo '{"error":"bad json"}';
        exit;
    }
    // Nooit een oudere versie over een nieuwere schrijven
    if (file_exists($file)) {
        $current = json_decode(file_get_contents($file), true);
        if (is_array($current) && ($current['updatedAt'] ?? 0) > ($data['updatedAt'] ?? 0)) {
            echo file_get_contents($file);
            exit;
        }
    }
    file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
    echo '{"ok":true}';
    exit;
}

if (file_exists($file)) {
    readfile($file);
} else {
    echo 'null';
}

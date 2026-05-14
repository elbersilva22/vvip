<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Suas chaves
define('MISTIC_CI', 'ci_3282n8k0qcuafp6');
define('MISTIC_CS', 'cs_ayuqzf43n2haxxzp0az7vzbch');
define('MISTIC_API', 'https://api.misticpay.com/api');

$action = $_GET['action'] ?? '';

$body = json_decode(file_get_contents('php://input'), true);

if ($action === 'create') {
    $url = MISTIC_API . '/transactions/create';
    $payload = [
        'amount'        => 14.90,
        'payerName'     => 'Cliente VIP',
        'payerDocument' => gerarCPF(),
        'transactionId' => 'vip-' . time() . '-' . substr(md5(rand()), 0, 5),
        'description'   => 'Acesso VIP - Clube Secreto'
    ];
    echo chamarAPI($url, 'POST', $payload);

} elseif ($action === 'check') {
    $url = MISTIC_API . '/transactions/check';
    $payload = ['transactionId' => (string)($body['transactionId'] ?? '')];
    echo chamarAPI($url, 'POST', $payload);

} else {
    echo json_encode(['error' => 'Ação inválida']);
}

function chamarAPI($url, $method, $data) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'ci: ' . MISTIC_CI,
        'cs: ' . MISTIC_CS,
    ]);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    $resp = curl_exec($ch);
    curl_close($ch);
    return $resp;
}

function gerarCPF() {
    $n = array_map(fn() => rand(0,9), array_fill(0,9,0));
    $s1 = array_sum(array_map(fn($i) => $n[$i]*(10-$i), range(0,8)));
    $d1 = ($s1*10)%11; if($d1>=10) $d1=0;
    $n[] = $d1;
    $s2 = array_sum(array_map(fn($i) => $n[$i]*(11-$i), range(0,9)));
    $d2 = ($s2*10)%11; if($d2>=10) $d2=0;
    $n[] = $d2;
    return implode('', $n);
}

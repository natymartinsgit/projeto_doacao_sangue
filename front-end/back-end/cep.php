<?php
// Verifica se o CEP foi enviado
if (isset($_GET['cep'])) {
    $cep = $_GET['cep'];

    // Lista de unidades de coleta (aqui você vai adicionar os dados reais)
    $unidades = [
        "06760-000" => ["Unidade Taboão da Serra", "Unidade Embu das Artes"],
        "06260-000" => ["Unidade Cotia", "Unidade Itapecerica da Serra"]
    ];

    // Verifica se o CEP existe na lista
    if (array_key_exists($cep, $unidades)) {
        echo json_encode(["unidades" => $unidades[$cep]]);
    } else {
        echo json_encode(["unidades" => []]);
    }
} else {
    echo json_encode(["error" => "CEP não informado."]);
}
?>

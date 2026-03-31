<?php
$data = file_get_contents("php://input");

if ($data) {
    file_put_contents("dados.json", $data);
    echo "OK";
} else {
    echo "Erro ao salvar";
}
?>
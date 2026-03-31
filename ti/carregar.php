<?php
if (file_exists("dados.json")) {
    echo file_get_contents("dados.json");
} else {
    echo json_encode([
        "escalaTI" => [],
        "equipeTI" => []
    ]);
}
?>
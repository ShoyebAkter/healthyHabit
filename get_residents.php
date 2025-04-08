<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $query = "SELECT id, area_id, area_name, name, email, password_hash , age, gender, interest, created_at FROM resident";
    $result = $conn->query($query);

    $residents = [];

    while ($row = $result->fetch_assoc()) {
        $residents[] = $row;
    }

    echo json_encode($residents);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>

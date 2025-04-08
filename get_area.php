<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$sql = "SELECT id, area_name FROM area ORDER BY area_name ASC";
$result = $conn->query($sql);

$areas = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $areas[] = [
            'id' => $row['id'],
            'name' => htmlspecialchars($row['area_name'])
        ];
    }
}

$conn->close();
echo json_encode($areas);
?>
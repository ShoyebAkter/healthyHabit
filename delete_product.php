<?php
// Enable CORS and set headers
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Get the raw POST data
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Validate that ID is set and is numeric
if (!isset($data['product_id']) || !is_numeric($data['product_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or missing product_id']);
    exit;
}

$productId = (int) $data['product_id'];

try {
    $stmt = $conn->prepare("DELETE FROM product WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $productId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No product found with that ID']);
        }
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>

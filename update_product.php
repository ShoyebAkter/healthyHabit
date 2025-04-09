<?php
// Enable CORS and set headers
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Check required fields
$requiredFields = [
    'product_id', // this is important to identify which product to update
    'name', 
    'description', 
    'healthBenefits',
    'price', 
    'stockQuantity', 
    'productCategory', 
    'pricingCategory'
];

foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing or empty field: $field"]);
        exit;
    }
}

try {
    // Prepare update statement
    $stmt = $conn->prepare("
        UPDATE product 
        SET 
            name = ?, 
            description = ?, 
            health_benefits = ?, 
            price = ?, 
            size_or_quantity = ?, 
            category = ?, 
            pricing_category = ?
        WHERE id = ?
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param(
        "sssdsssi", // s: string, d: double, i: integer
        $data['name'],
        $data['description'],
        $data['healthBenefits'],
        $data['price'],
        $data['stockQuantity'],
        $data['productCategory'],
        $data['pricingCategory'],
        $data['product_id']
    );

    // Execute
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully'
        ]);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>

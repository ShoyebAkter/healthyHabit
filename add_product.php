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

// Validate required fields
$requiredFields = [
    'sme_id', 'name', 'description', 'healthBenefits',
    'price', 'stockQuantity', 'productCategory', 'pricingCategory'
];

foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing or empty required field: $field"]);
        $conn->close();
        exit;
    }
}

try {
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO product (
        sme_id, 
        name, 
        description, 
        health_benefits, 
        price, 
        size_or_quantity, 
        category, 
        pricing_category,
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param(
        "isssdiss", // i: integer, s: string, d: double
        $data['sme_id'],
        $data['name'],
        $data['description'],
        $data['healthBenefits'],
        $data['price'],
        $data['stockQuantity'],
        $data['productCategory'],
        $data['pricingCategory']
    );

    // Execute the query
    if ($stmt->execute()) {
        $productId = $stmt->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully',
            'product_id' => $productId
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
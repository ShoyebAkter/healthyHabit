<?php
// Enable CORS and set headers
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    // Query to get all products
    $sql = "SELECT * FROM product ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'id' => $row['id'],
            'sme_id' => $row['sme_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'healthBenefits' => $row['health_benefits'],
            'price' => (float)$row['price'],
            'stockQuantity' => (int)$row['size_or_quantity'],
            'productCategory' => $row['category'],
            'pricingCategory' => $row['pricing_category'],
            'createdAt' => $row['created_at'],
            'imageUrl' => $row['image_url'],
            'vote_count' => (int)$row['vote_count'] // <-- added here
        ];
    }

    echo json_encode([
        'success' => true,
        'products' => $products
    ]);

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

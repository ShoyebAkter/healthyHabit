<?php
// vote.php

// Enable error reporting while debugging (remove or comment out in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS and JSON response headers
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Include connection from config.php
require 'config.php';

$response = ['success' => false, 'message' => ''];

// Get the JSON input sent from the client
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    $response['message'] = "Invalid JSON data";
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $residentId = isset($data['resident_id']) ? $data['resident_id'] : null;
    $productId = isset($data['product_id']) ? $data['product_id'] : null;
    
    // Validate required parameters
    if (!$residentId || !$productId) {
        $response['message'] = "Missing required parameters";
        echo json_encode($response);
        exit;
    }
    
    // Check if the resident exists
    $stmt = $conn->prepare("SELECT 1 FROM resident WHERE id = ? LIMIT 1");
    if (!$stmt) {
        $response['message'] = "Database error: " . $conn->error;
        echo json_encode($response);
        exit;
    }
    $stmt->bind_param("i", $residentId);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        $response['message'] = "Resident not found";
        echo json_encode($response);
        exit;
    }
    $stmt->close();

    // Check if the product exists
    $stmt = $conn->prepare("SELECT 1 FROM product WHERE id = ? LIMIT 1");
    if (!$stmt) {
        $response['message'] = "Database error: " . $conn->error;
        echo json_encode($response);
        exit;
    }
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        $response['message'] = "Product not found";
        echo json_encode($response);
        exit;
    }
    $stmt->close();

    // Begin transaction
    $conn->begin_transaction();

    try {
        // Insert vote into vote table
        $stmt = $conn->prepare("INSERT INTO vote (resident_id, product_id) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("ii", $residentId, $productId);
        $stmt->execute();
        $stmt->close();
        
        // Update product vote count
        $stmt = $conn->prepare("UPDATE product SET vote_count = vote_count + 1 WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $stmt->close();
        
        // Commit transaction
        $conn->commit();
        
        // Retrieve the new vote count for the product
        $result = $conn->query("SELECT vote_count FROM product WHERE id = $productId");
        $voteCount = $result ? $result->fetch_assoc()['vote_count'] : null;
        
        $response['success'] = true;
        $response['message'] = "Vote recorded successfully";
        $response['vote_count'] = $voteCount;
    } catch (Exception $e) {
        // Roll back the transaction on error
        $conn->rollback();

        // Check for duplicate entry error (error code 1062)
        if ($conn->errno == 1062) {
            $response['message'] = "Error: " . $e->getMessage();
        } else {
            
            $response['message'] = "You have already voted for this product";
        }
    }
} else {
    $response['message'] = "Invalid request method";
}

echo json_encode($response);
?>

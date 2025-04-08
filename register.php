<?php
require_once 'config.php';

// Set CORS headers (more secure than wildcard)
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Changed to POST
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input (more secure than $_POST for API endpoints)
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['area_id', 'area_name', 'name', 'email', 'password', 'age', 'gender', 'interest'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

try {
    // Check if email already exists
    $check = $conn->prepare("SELECT id FROM resident WHERE email = ?");
    $check->bind_param("s", $input['email']);
    $check->execute();
    $check->store_result();
    
    if ($check->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }
    $check->close();

    // Prepare resident data
    $resident = [
        'area_id' => (int)$input['area_id'],
        'area_name' => htmlspecialchars($input['area_name']),
        'name' => htmlspecialchars($input['name']),
        'email' => $input['email'],
        'password_hash' => password_hash($input['password'], PASSWORD_DEFAULT),
        'age' => (int)$input['age'],
        'gender' => htmlspecialchars($input['gender']),
        'interest' => htmlspecialchars($input['interest'])
    ];

    // Insert data
    $stmt = $conn->prepare("INSERT INTO resident (
        area_id, area_name, name, email, password_hash, 
        age, gender, interest
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "issssiss",
        $resident['area_id'],
        $resident['area_name'],
        $resident['name'],
        $resident['email'],
        $resident['password_hash'],
        $resident['age'],
        $resident['gender'],
        $resident['interest']
    );

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        throw new Exception($conn->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($check)) $check->close();
    $conn->close();
}
?>
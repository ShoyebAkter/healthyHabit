<?php
require_once 'config.php';

// Set CORS headers
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get and decode JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['companyName', 'name', 'email', 'password', 'contact', 'sustainability_score'];
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
    $check = $conn->prepare("SELECT id FROM sme WHERE email = ?");
    $check->bind_param("s", $input['email']);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }
    $check->close();

    // Sanitize and prepare data
    $companyName = htmlspecialchars($input['companyName']);
    $name = htmlspecialchars($input['name']);
    $email = $input['email'];
    $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
    $contact = htmlspecialchars($input['contact']);
    $sustainability_score = (float)$input['sustainability_score'];

    // Insert into sme table
    $stmt = $conn->prepare("INSERT INTO sme (
        companyName, name, email, password, contact, sustainability_score
    ) VALUES (?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("sssssd", $companyName, $name, $email, $passwordHash, $contact, $sustainability_score);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'SME added successfully']);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>

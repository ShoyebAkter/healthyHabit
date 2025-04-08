<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST"); // Changed to POST
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
require 'config.php';


$data = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

// Check both tables
$query = "(SELECT 'resident' as user_type, id, email, password_hash FROM resident WHERE email = '$email')
          UNION
          (SELECT 'sme' as user_type, id, email, password FROM sme WHERE email = '$email')
          LIMIT 1";

$result = $conn->query($query);

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email not found']);
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password_hash'])) {
    // Remove sensitive data before sending back
    unset($user['password_hash']);
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'message' => 'Incorrect password']);
}

$conn->close();
?>
<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ✅ Connect to database
    $host = "localhost";
    $user = "root";
    $password = "";
    $dbname = "healthyhabit";

    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn->connect_error) {
        die("❌ Connection failed: " . $conn->connect_error);
    }

    // ✅ Get form data
    $areaName = $_POST['areaName'];

    // ✅ Fallback if session not set
    $addedBy = isset($_SESSION['username']) ? $_SESSION['username'] : "Admin";

    // ✅ Insert into database
    $sql = "INSERT INTO area (area_name, added_by) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $areaName, $addedBy);

    if ($stmt->execute()) {
        echo "✅ New area added successfully!";
    } else {
        echo "❌ Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405); // Only allow POST
    echo "Method not allowed.";
}
?>

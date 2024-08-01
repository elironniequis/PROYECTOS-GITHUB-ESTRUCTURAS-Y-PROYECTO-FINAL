<?php
include 'db_connect.php';

$title = $_POST['title'];
$author = $_POST['author'];

$sql = "INSERT INTO libros (title, author) VALUES ('$title', '$author')";

if ($conn->query($sql) === TRUE) {
    echo "Libro agregado correctamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

header("Location: index.php");
exit();
?>

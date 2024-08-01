<?php
include 'db_connect.php';

$id = $_GET['id'];

$sql = "SELECT * FROM libros WHERE id = $id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $book = $result->fetch_assoc();
    header("Location: index.php?id=$id&title={$book['title']}&author={$book['author']}");
} else {
    echo "Libro no encontrado";
}

$conn->close();
?>

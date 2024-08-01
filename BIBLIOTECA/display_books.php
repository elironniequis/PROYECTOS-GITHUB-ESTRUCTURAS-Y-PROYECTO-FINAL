<?php
include 'db_connect.php';

$sql = "SELECT * FROM libros ORDER BY id";
$result = $conn->query($sql);

$books = "";

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $books .= "<div class='book-item'>ID: {$row['id']}, Título: {$row['title']}, Autor: {$row['author']}</div>";
    }
} else {
    $books = "No hay libros en la biblioteca.";
}

$conn->close();

header("Location: index.php?books=" . urlencode($books));
exit();
?>

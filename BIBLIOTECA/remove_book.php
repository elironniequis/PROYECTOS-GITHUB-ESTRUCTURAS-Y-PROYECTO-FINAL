<?php
include 'db_connect.php';

$id = $_POST['id'];

$sql = "DELETE FROM libros WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo "Libro eliminado correctamente";
} else {
    echo "Error al eliminar el libro: " . $conn->error;
}

$conn->close();

header("Location: index.php");
exit();
?>

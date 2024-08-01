<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biblioteca - PHP y MySQL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .book-list {
            margin-top: 20px;
        }
        .book-item {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Biblioteca - PHP y MySQL</h1>
        <div>
            <h2>Agregar Libro</h2>
            <form action="add_book.php" method="post">
                <label for="book-title">Título:</label>
                <input type="text" id="book-title" name="title"><br>
                <label for="book-author">Autor:</label>
                <input type="text" id="book-author" name="author"><br>
                <button type="submit">Agregar Libro</button>
            </form>
        </div>
        <div>
            <h2>Buscar Libro</h2>
            <form action="search_book.php" method="get">
                <label for="search-id">ID:</label>
                <input type="number" id="search-id" name="id">
                <button type="submit">Buscar</button>
            </form>
            <p id="search-result">
                <?php
                if (isset($_GET['title'])) {
                    echo "Libro encontrado: ID: {$_GET['id']}, Título: {$_GET['title']}, Autor: {$_GET['author']}";
                }
                ?>
            </p>
        </div>
        <div>
            <h2>Eliminar Libro</h2>
            <form action="remove_book.php" method="post">
                <label for="remove-id">ID:</label>
                <input type="number" id="remove-id" name="id">
                <button type="submit">Eliminar</button>
            </form>
        </div>
        <div>
            <h2>Libros en la Biblioteca</h2>
            <form action="display_books.php" method="get">
                <button type="submit">Mostrar Libros</button>
            </form>
            <div id="book-list" class="book-list">
                <?php
                if (isset($_GET['books'])) {
                    echo $_GET['books'];
                }
                ?>
            </div>
        </div>
    </div>
</body>
</html>

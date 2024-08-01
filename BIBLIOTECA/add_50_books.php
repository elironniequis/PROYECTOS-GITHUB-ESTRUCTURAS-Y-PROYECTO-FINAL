<?php
include 'db_connect.php';

$books = [
    ['Cien años de soledad', 'Gabriel García Márquez'],
    ['Don Quijote de la Mancha', 'Miguel de Cervantes'],
    ['La casa de los espíritus', 'Isabel Allende'],
    ['El amor en los tiempos del cólera', 'Gabriel García Márquez'],
    ['Crónica de una muerte anunciada', 'Gabriel García Márquez'],
    ['Rayuela', 'Julio Cortázar'],
    ['Pedro Páramo', 'Juan Rulfo'],
    ['Ficciones', 'Jorge Luis Borges'],
    ['El Aleph', 'Jorge Luis Borges'],
    ['El túnel', 'Ernesto Sabato'],
    ['Los detectives salvajes', 'Roberto Bolaño'],
    ['2666', 'Roberto Bolaño'],
    ['La ciudad y los perros', 'Mario Vargas Llosa'],
    ['Conversación en La Catedral', 'Mario Vargas Llosa'],
    ['La guerra del fin del mundo', 'Mario Vargas Llosa'],
    ['Sobre héroes y tumbas', 'Ernesto Sabato'],
    ['El señor presidente', 'Miguel Ángel Asturias'],
    ['El otoño del patriarca', 'Gabriel García Márquez'],
    ['La fiesta del chivo', 'Mario Vargas Llosa'],
    ['La sombra del viento', 'Carlos Ruiz Zafón'],
    ['El juego del ángel', 'Carlos Ruiz Zafón'],
    ['El prisionero del cielo', 'Carlos Ruiz Zafón'],
    ['La catedral del mar', 'Ildefonso Falcones'],
    ['La mano de Fátima', 'Ildefonso Falcones'],
    ['El hereje', 'Miguel Delibes'],
    ['La colmena', 'Camilo José Cela'],
    ['La familia de Pascual Duarte', 'Camilo José Cela'],
    ['Los santos inocentes', 'Miguel Delibes'],
    ['El camino', 'Miguel Delibes'],
    ['Cinco horas con Mario', 'Miguel Delibes'],
    ['El árbol de la ciencia', 'Pío Baroja'],
    ['Trafalgar', 'Benito Pérez Galdós'],
    ['Marianela', 'Benito Pérez Galdós'],
    ['Fortunata y Jacinta', 'Benito Pérez Galdós'],
    ['La Regenta', 'Leopoldo Alas Clarín'],
    ['Nada', 'Carmen Laforet'],
    ['Tiempo de silencio', 'Luis Martín-Santos'],
    ['Los girasoles ciegos', 'Alberto Méndez'],
    ['La lluvia amarilla', 'Julio Llamazares'],
    ['Rinconete y Cortadillo', 'Miguel de Cervantes'],
    ['El Lazarillo de Tormes', 'Anónimo'],
    ['El libro de buen amor', 'Arcipreste de Hita'],
    ['El Cantar de Mio Cid', 'Anónimo'],
    ['La Celestina', 'Fernando de Rojas'],
    ['Fuenteovejuna', 'Lope de Vega'],
    ['El perro del hortelano', 'Lope de Vega'],
    ['Don Gil de las calzas verdes', 'Tirso de Molina'],
    ['El burlador de Sevilla', 'Tirso de Molina'],
    ['La vida es sueño', 'Calderón de la Barca'],
    ['El alcalde de Zalamea', 'Calderón de la Barca']
];

foreach ($books as $book) {
    $title = $book[0];
    $author = $book[1];
    $sql = "INSERT INTO libros (title, author) VALUES ('$title', '$author')";
    if ($conn->query($sql) === TRUE) {
        echo "Libro '$title' agregado correctamente<br>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error . "<br>";
    }
}

$conn->close();
?>

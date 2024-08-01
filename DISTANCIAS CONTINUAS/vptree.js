// Clase Nodo para representar cada nodo del Árbol VP
class Nodo {
    constructor(cancion) {
        this.cancion = cancion; // La canción que se almacena en el nodo
        this.radio = 0; // El radio del nodo
        this.interno = null; // El nodo interno (cercano)
        this.externo = null; // El nodo externo (lejano)
    }
}

// Clase ArbolVP para representar el Árbol VP
class ArbolVP {
    constructor(canciones, funcionDistancia) {
        this.funcionDistancia = funcionDistancia; // Función para calcular la distancia entre dos canciones
        this.raiz = this.construirArbol(canciones); // Construir el árbol con las canciones proporcionadas
    }

    // Método para construir el árbol recursivamente
    construirArbol(canciones) {
        if (canciones.length === 0) return null; // Si no hay canciones, retornar null
        const indice = Math.floor(Math.random() * canciones.length); // Elegir un índice aleatorio
        const cancion = canciones[indice]; // Elegir una canción basada en el índice aleatorio
        const nodo = new Nodo(cancion); // Crear un nodo con la canción
        canciones.splice(indice, 1); // Eliminar la canción del arreglo de canciones

        if (canciones.length === 0) return nodo; // Si no hay más canciones, retornar el nodo

        const distancias = canciones.map(c => this.funcionDistancia(cancion.features, c.features)); // Calcular las distancias desde la canción del nodo a las demás
        const mediana = this.median(distancias); // Calcular la mediana de las distancias
        nodo.radio = mediana; // Asignar la mediana como el radio del nodo

        // Dividir las canciones en internas (cercanas) y externas (lejanas)
        const cancionesInternas = canciones.filter((c, i) => distancias[i] <= mediana);
        const cancionesExternas = canciones.filter((c, i) => distancias[i] > mediana);

        // Construir los subárboles interno y externo recursivamente
        nodo.interno = this.construirArbol(cancionesInternas);
        nodo.externo = this.construirArbol(cancionesExternas);

        return nodo; // Retornar el nodo construido
    }

    // Método para calcular la mediana de un arreglo de valores
    median(valores) {
        valores.sort((a, b) => a - b); // Ordenar los valores de menor a mayor
        const medio = Math.floor(valores.length / 2); // Calcular el índice medio
        return valores[medio]; // Retornar el valor en el índice medio
    }

    // Método para buscar las canciones más similares a una canción de consulta
    buscar(cancion, maxResultados, nodo = this.raiz, vecinos = []) {
        if (!nodo) return vecinos; // Si no hay nodo, retornar los vecinos encontrados

        const distancia = this.funcionDistancia(cancion.features, nodo.cancion.features); // Calcular la distancia entre la canción de consulta y la canción del nodo
        if (vecinos.length < maxResultados || distancia < vecinos[0].distancia) {
            vecinos.push({ cancion: nodo.cancion, distancia: distancia }); // Añadir la canción y la distancia a los vecinos
            vecinos.sort((a, b) => b.distancia - a.distancia); // Ordenar los vecinos por distancia
            if (vecinos.length > maxResultados) vecinos.shift(); // Mantener solo los maxResultados vecinos
        }

        const revisarInternoPrimero = distancia < nodo.radio; // Determinar si se debe revisar primero el nodo interno

        if (revisarInternoPrimero) {
            this.buscar(cancion, maxResultados, nodo.interno, vecinos); // Buscar en el subárbol interno
            if (vecinos.length < maxResultados || Math.abs(nodo.radio - distancia) < vecinos[0].distancia) {
                this.buscar(cancion, maxResultados, nodo.externo, vecinos); // Buscar en el subárbol externo si es necesario
            }
        } else {
            this.buscar(cancion, maxResultados, nodo.externo, vecinos); // Buscar en el subárbol externo
            if (vecinos.length < maxResultados || Math.abs(nodo.radio - distancia) < vecinos[0].distancia) {
                this.buscar(cancion, maxResultados, nodo.interno, vecinos); // Buscar en el subárbol interno si es necesario
            }
        }

        return vecinos; // Retornar los vecinos encontrados
    }
}

// Función para calcular la distancia euclidiana entre dos vectores
function distanciaEuclidiana(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

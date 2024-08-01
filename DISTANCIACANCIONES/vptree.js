class Nodo {
    constructor(cancion) {
        this.cancion = cancion;
        this.radio = 0;
        this.interno = null;
        this.externo = null;
    }
}

class ArbolVP {
    constructor(canciones, funcionDistancia) {
        this.funcionDistancia = funcionDistancia;
        this.raiz = this.construirArbol(canciones);
    }

    construirArbol(canciones) {
        if (canciones.length === 0) return null;
        const indice = Math.floor(Math.random() * canciones.length);
        const cancion = canciones[indice];
        const nodo = new Nodo(cancion);
        canciones.splice(indice, 1);

        if (canciones.length === 0) return nodo;

        const distancias = canciones.map(c => this.funcionDistancia(cancion.features, c.features));
        const mediana = this.median(distancias);
        nodo.radio = mediana;

        const cancionesInternas = canciones.filter((c, i) => distancias[i] <= mediana);
        const cancionesExternas = canciones.filter((c, i) => distancias[i] > mediana);

        nodo.interno = this.construirArbol(cancionesInternas);
        nodo.externo = this.construirArbol(cancionesExternas);

        return nodo;
    }

    median(valores) {
        valores.sort((a, b) => a - b);
        const medio = Math.floor(valores.length / 2);
        return valores[medio];
    }

    buscar(cancion, maxResultados, nodo = this.raiz, vecinos = []) {
        if (!nodo) return vecinos;

        const distancia = this.funcionDistancia(cancion.features, nodo.cancion.features);
        if (vecinos.length < maxResultados || distancia < vecinos[0].distancia) {
            vecinos.push({ cancion: nodo.cancion, distancia: distancia });
            vecinos.sort((a, b) => b.distancia - a.distancia);
            if (vecinos.length > maxResultados) vecinos.shift();
        }

        const revisarInternoPrimero = distancia < nodo.radio;

        if (revisarInternoPrimero) {
            this.buscar(cancion, maxResultados, nodo.interno, vecinos);
            if (vecinos.length < maxResultados || Math.abs(nodo.radio - distancia) < vecinos[0].distancia) {
                this.buscar(cancion, maxResultados, nodo.externo, vecinos);
            }
        } else {
            this.buscar(cancion, maxResultados, nodo.externo, vecinos);
            if (vecinos.length < maxResultados || Math.abs(nodo.radio - distancia) < vecinos[0].distancia) {
                this.buscar(cancion, maxResultados, nodo.interno, vecinos);
            }
        }

        return vecinos;
    }
}

// Función para calcular la distancia euclidiana entre dos canciones
function distanciaEuclidiana(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

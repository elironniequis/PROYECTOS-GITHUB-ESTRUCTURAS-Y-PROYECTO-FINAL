class Nodo {
    constructor(punto) {
        this.punto = punto;
        this.hijos = {};
    }
}

class ArbolBK {
    constructor(funcionDistancia) {
        this.raiz = null;
        this.funcionDistancia = funcionDistancia;
    }

    agregar(punto) {
        if (this.raiz === null) {
            this.raiz = new Nodo(punto);
        } else {
            this._agregar(this.raiz, punto);
        }
    }

    _agregar(nodo, punto) {
        const distancia = this.funcionDistancia(nodo.punto, punto);
        if (nodo.hijos[distancia] === undefined) {
            nodo.hijos[distancia] = new Nodo(punto);
        } else {
            this._agregar(nodo.hijos[distancia], punto);
        }
    }

    buscar(punto, distanciaMaxima) {
        const resultados = [];
        this._buscar(this.raiz, punto, distanciaMaxima, resultados);
        return resultados;
    }

    _buscar(nodo, punto, distanciaMaxima, resultados) {
        const distancia = this.funcionDistancia(nodo.punto, punto);
        if (distancia <= distanciaMaxima) {
            resultados.push({ punto: nodo.punto, distancia: distancia });
        }
        for (let d = Math.max(0, distancia - distanciaMaxima); d <= distancia + distanciaMaxima; d++) {
            if (nodo.hijos[d] !== undefined) {
                this._buscar(nodo.hijos[d], punto, distanciaMaxima, resultados);
            }
        }
    }
}

// Función de distancia de Levenshtein
function distanciaLevenshtein(a, b) {
    const matriz = [];

    for (let i = 0; i <= b.length; i++) {
        matriz[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matriz[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matriz[i][j] = matriz[i - 1][j - 1];
            } else {
                matriz[i][j] = Math.min(
                    matriz[i - 1][j - 1] + 1,
                    Math.min(matriz[i][j - 1] + 1, matriz[i - 1][j] + 1)
                );
            }
        }
    }

    return matriz[b.length][a.length];
}

const arbol = new ArbolBK(distanciaLevenshtein);

function dividirEnFrases(texto) {
    return texto.match(/[^\.!\?]+[\.!\?]+/g) || [texto];
}

function detectarPlagio() {
    const texto1 = document.getElementById('text1').value;
    const texto2 = document.getElementById('text2').value;
    const frasesTexto1 = dividirEnFrases(texto1);
    const frasesTexto2 = dividirEnFrases(texto2);

    // Construir el árbol BK con las frases del primer texto
    frasesTexto1.forEach(frase => arbol.agregar(frase.trim()));

    const resultados = [];
    const distanciaMaxima = 5; // Puedes ajustar esta distancia según sea necesario

    // Buscar frases similares en el segundo texto
    frasesTexto2.forEach(frase => {
        const similares = arbol.buscar(frase.trim(), distanciaMaxima);
        if (similares.length > 0) {
            resultados.push({ frase, similares });
        }
    });

    mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h3>Resultados de Detección de Plagio:</h3>';
    if (resultados.length > 0) {
        resultados.forEach(result => {
            resultDiv.innerHTML += `<p>Frase del Texto 2: "${result.frase}"</p>`;
            resultDiv.innerHTML += '<ul>';
            result.similares.forEach(similar => {
                resultDiv.innerHTML += `<li>Frase similar del Texto 1: "${similar.punto}" (distancia: ${similar.distancia})</li>`;
            });
            resultDiv.innerHTML += '</ul>';
        });
    } else {
        resultDiv.innerHTML += '<p>No se encontraron frases similares.</p>';
    }
}

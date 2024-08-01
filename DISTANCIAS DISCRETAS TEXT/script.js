// Clase Nodo para el árbol BK
class Nodo {
    constructor(punto) {
        this.punto = punto;
        this.hijos = {};
    }
}

// Clase Árbol BK
class ArbolBK {
    constructor(funcionDistancia) {
        this.raiz = null;
        this.funcionDistancia = funcionDistancia;
    }

    // Método para agregar un punto al árbol
    agregar(punto) {
        if (this.raiz === null) {
            this.raiz = new Nodo(punto);
        } else {
            this._agregar(this.raiz, punto);
        }
    }

    // Método recursivo para agregar un punto
    _agregar(nodo, punto) {
        const distancia = this.funcionDistancia(nodo.punto, punto);
        if (nodo.hijos[distancia] === undefined) {
            nodo.hijos[distancia] = new Nodo(punto);
        } else {
            this._agregar(nodo.hijos[distancia], punto);
        }
    }

    // Método para buscar puntos dentro del árbol según la distancia máxima
    buscar(punto, distanciaMaxima) {
        const resultados = [];
        if (this.raiz !== null) {
            this._buscar(this.raiz, punto, distanciaMaxima, resultados);
        }
        return resultados;
    }

    // Método recursivo para buscar puntos
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

// Creación del árbol BK con distancia de Levenshtein
const arbol = new ArbolBK(distanciaLevenshtein);

// Nombres de ejemplo para agregar al árbol
const nombres = [
    'Ana', 'Andrés', 'Alberto', 'Beatriz', 'Carlos', 'Clara', 'David', 'Diana', 'Elena', 'Felipe',
    'Fernanda', 'Gustavo', 'Gabriela', 'Hugo', 'Isabela', 'Ignacio', 'Julieta', 'Juan', 'Laura',
    'Luis', 'María', 'Miguel', 'Natalia', 'Óscar', 'Olivia', 'Pedro', 'Paula', 'Raúl', 'Renata',
    'Santiago', 'Sofía', 'Tomás', 'Valentina', 'Xavier', 'Yolanda', 'Zacarías'
];

// Agregar todos los nombres al árbol BK
nombres.forEach(nombre => {
    arbol.agregar(nombre);
});

// Función para buscar un nombre y mostrar los resultados
function buscarNombre() {
    const nombreBusqueda = document.getElementById('searchName').value;
    const distanciaMaxima = parseInt(document.getElementById('maxDistance').value, 10);
    if (nombreBusqueda) {
        const resultados = arbol.buscar(nombreBusqueda, distanciaMaxima);
        mostrarArbol(resultados);
    }
}

// Función para mostrar el árbol BK con los resultados
function mostrarArbol(resultados) {
    // Limpia el SVG antes de dibujar
    d3.select("#treeSvg").selectAll("*").remove();

    const treeData = formatData(resultados);

    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#treeSvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([height, width]);
    treeLayout(root);

    // Enlaces
    svg.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Nodos
    const node = svg.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
        .attr('r', 5);

    node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -13 : 13)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.punto);
}

// Función para formatear los datos en una estructura de árbol
function formatData(resultados) {
    const data = { punto: "Raíz", children: [] };
    const map = { "Raíz": data };

    resultados.forEach(resultado => {
        const parts = resultado.punto.split('');
        let currentLevel = map["Raíz"];
        parts.forEach((part, i) => {
            if (!map[part]) {
                const newPart = { punto: part, children: [] };
                map[part] = newPart;
                currentLevel.children.push(newPart);
            }
            currentLevel = map[part];
        });
    });

    return data;
}

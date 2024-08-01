// Definir las características de las imágenes
const images = [
    { id: 1, features: [128, 64, 64, 0.5, 0.8] }, // [R, G, B, textura, forma]
    { id: 2, features: [130, 60, 70, 0.6, 0.7] },
    { id: 3, features: [120, 65, 60, 0.4, 0.9] },
    { id: 4, features: [125, 70, 80, 0.7, 0.6] },
    { id: 5, features: [140, 55, 75, 0.8, 0.5] },
    { id: 6, features: [150, 50, 90, 0.3, 0.4] },
    { id: 7, features: [110, 45, 100, 0.2, 0.3] },
    { id: 8, features: [160, 75, 65, 0.9, 0.1] },
    { id: 9, features: [170, 85, 55, 0.1, 0.2] },
    { id: 10, features: [180, 95, 45, 0.5, 0.3] },
    { id: 11, features: [190, 85, 35, 0.7, 0.2] },
    { id: 12, features: [200, 75, 25, 0.6, 0.4] },
    { id: 13, features: [210, 65, 15, 0.8, 0.5] },
    { id: 14, features: [220, 55, 5, 0.3, 0.6] },
    { id: 15, features: [230, 45, 95, 0.4, 0.7] }
];

// Definir la función de distancia
function euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

// Implementar el nodo y el árbol VP
class Node {
    constructor(image) {
        this.image = image;
        this.radius = 0;
        this.inside = null;
        this.outside = null;
    }
}

class VPTree {
    constructor(images, distanceFunc) {
        this.distanceFunc = distanceFunc;
        this.root = this.buildTree(images);
    }

    buildTree(images) {
        if (images.length === 0) return null;

        const index = Math.floor(Math.random() * images.length);
        const image = images[index];
        const node = new Node(image);
        images.splice(index, 1);

        if (images.length === 0) return node;

        const distances = images.map(img => this.distanceFunc(image.features, img.features));
        const median = this.median(distances);
        node.radius = median;

        const insideImages = images.filter((img, i) => distances[i] <= median);
        const outsideImages = images.filter((img, i) => distances[i] > median);

        node.inside = this.buildTree(insideImages);
        node.outside = this.buildTree(outsideImages);

        return node;
    }

    median(values) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values[mid];
    }

    search(image, maxResults, node = this.root, neighbors = []) {
        if (!node) return neighbors;

        const dist = this.distanceFunc(image.features, node.image.features);
        if (neighbors.length < maxResults || dist < neighbors[0].distance) {
            neighbors.push({ image: node.image, distance: dist });
            neighbors.sort((a, b) => b.distance - a.distance);
            if (neighbors.length > maxResults) neighbors.shift();
        }

        const checkInsideFirst = dist < node.radius;

        if (checkInsideFirst) {
            this.search(image, maxResults, node.inside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(image, maxResults, node.outside, neighbors);
            }
        } else {
            this.search(image, maxResults, node.outside, neighbors);
            if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0].distance) {
                this.search(image, maxResults, node.inside, neighbors);
            }
        }

        return neighbors;
    }
}

// Mostrar las características de las imágenes existentes en una tabla
function mostrarImagenesExistentes() {
    const imagenesTbody = document.getElementById('imagenesExistentes').querySelector('tbody');
    imagenesTbody.innerHTML = '';
    images.forEach(image => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${image.id}</td>
            <td>${image.features[0]}</td>
            <td>${image.features[1]}</td>
            <td>${image.features[2]}</td>
            <td>${image.features[3]}</td>
            <td>${image.features[4]}</td>
        `;
        imagenesTbody.appendChild(tr);
    });
}

// Usar el Árbol VP para encontrar imágenes similares
function buscarImagenesSimilares() {
    const tree = new VPTree(images, euclideanDistance);
    
    const queryId = parseInt(document.getElementById('queryId').value);
    const queryRGB = document.getElementById('queryRGB').value.split(',').map(Number);
    const queryTextura = parseFloat(document.getElementById('queryTextura').value);
    const queryForma = parseFloat(document.getElementById('queryForma').value);
    
    const queryImage = { id: queryId, features: [...queryRGB, queryTextura, queryForma] };
    const maxResults = 2;
    
    const similarImages = tree.search(queryImage, maxResults);
    
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';
    similarImages.forEach(result => {
        const div = document.createElement('div');
        div.textContent = `ID: ${result.image.id}, Distancia: ${result.distance.toFixed(2)}`;
        resultadosDiv.appendChild(div);
    });
}

// Llamar a la función para mostrar las imágenes existentes al cargar la página
document.addEventListener('DOMContentLoaded', mostrarImagenesExistentes);

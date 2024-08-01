class MultiVPTree {
    constructor(points, numReferences = 3, leafSize = 10) {
        this.numReferences = numReferences;
        this.leafSize = leafSize;
        this.root = this.buildTree(points);
    }

    buildTree(points) {
        if (points.length <= this.leafSize) {
            return { points };
        }

        const references = [];
        for (let i = 0; i < this.numReferences; i++) {
            references.push(points[Math.floor(Math.random() * points.length)]);
        }

        const distances = points.map(point => references.map(ref => this.distance(point, ref)));
        const medianDistances = references.map((_, i) => this.median(distances.map(d => d[i])));
        const leftPoints = points.filter((_, idx) => distances[idx].every((d, i) => d <= medianDistances[i]));
        const rightPoints = points.filter((_, idx) => !leftPoints.includes(points[idx]));

        return {
            references,
            medianDistances,
            left: this.buildTree(leftPoints),
            right: this.buildTree(rightPoints)
        };
    }

    search(query, k = 3) {
        return this._search(this.root, query, k);
    }

    _search(node, query, k) {
        if (node.points) {
            const distances = node.points.map(point => this.distance(query, point));
            return node.points.map((point, idx) => [point, distances[idx]]).sort((a, b) => a[1] - b[1]).slice(0, k);
        }

        const queryDistances = node.references.map(ref => this.distance(query, ref));
        const exploreLeft = queryDistances.every((d, i) => d <= node.medianDistances[i]);
        const bestBranch = exploreLeft ? node.left : node.right;
        const otherBranch = exploreLeft ? node.right : node.left;
        let bestResults = this._search(bestBranch, query, k);

        const bestDistances = bestResults.map(result => result[1]);
        if (queryDistances.some((d, i) => d <= node.medianDistances[i] + Math.max(...bestDistances))) {
            const otherResults = this._search(otherBranch, query, k);
            bestResults = bestResults.concat(otherResults).sort((a, b) => a[1] - b[1]).slice(0, k);
        }

        return bestResults;
    }

    distance(a, b) {
        return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0));
    }

    median(values) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
    }
}

// Ejemplo de vectores de características de imágenes
const imageFeatures = [
    [0.1, 0.2, 0.3], [0.3, 0.4, 0.5], [0.5, 0.6, 0.7],
    [0.7, 0.8, 0.9], [0.9, 1.0, 1.1], [1.1, 1.2, 1.3],
    [1.3, 1.4, 1.5], [1.5, 1.6, 1.7], [1.7, 1.8, 1.9],
    [1.9, 2.0, 2.1], [2.1, 2.2, 2.3], [2.3, 2.4, 2.5],
    [2.5, 2.6, 2.7], [2.7, 2.8, 2.9], [2.9, 3.0, 3.1],
    [3.1, 3.2, 3.3], [3.3, 3.4, 3.5], [3.5, 3.6, 3.7]
];

// URLs de las imágenes (animales)
const imageUrls = [
    "https://placedog.net/100/100?id=1", "https://placedog.net/100/100?id=2", "https://placedog.net/100/100?id=3",
    "https://placedog.net/100/100?id=4", "https://placedog.net/100/100?id=5", "https://placedog.net/100/100?id=6",
    "https://placedog.net/100/100?id=7", "https://placedog.net/100/100?id=8", "https://placedog.net/100/100?id=9",
    "https://placedog.net/100/100?id=10", "https://placedog.net/100/100?id=11", "https://placedog.net/100/100?id=12",
    "https://placedog.net/100/100?id=13", "https://placedog.net/100/100?id=14", "https://placedog.net/100/100?id=15",
    "https://placedog.net/100/100?id=16", "https://placedog.net/100/100?id=17", "https://placedog.net/100/100?id=18"
];

const tree = new MultiVPTree(imageFeatures);

document.addEventListener("DOMContentLoaded", () => {
    const imagesList = document.getElementById("images-list");
    imageFeatures.forEach((features, index) => {
        const div = document.createElement("div");
        div.className = "image-item";
        div.dataset.index = index;

        const img = document.createElement("img");
        img.src = imageUrls[index];
        img.alt = `Imagen ${index + 1}`;

        div.appendChild(img);
        div.onclick = () => searchImages(index);
        imagesList.appendChild(div);
    });
});

function searchImages(index) {
    const query = imageFeatures[index];
    const results = tree.search(query, 3);

    const resultsList = document.getElementById("results-list");
    resultsList.innerHTML = "";
    results.forEach(result => {
        const li = document.createElement("li");
        const imgIndex = imageFeatures.findIndex(features => features === result[0]);
        li.innerHTML = `<img src="${imageUrls[imgIndex]}" alt="Imagen ${imgIndex + 1}" style="width: 50px; height: 50px; vertical-align: middle; margin-right: 10px;"> Imagen ${imgIndex + 1}, Distancia: ${result[1].toFixed(4)}`;
        resultsList.appendChild(li);
    });
}

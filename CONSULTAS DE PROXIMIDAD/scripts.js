// scripts.js
class KDNode {
    constructor(point, axis, left = null, right = null) {
        this.point = point;
        this.axis = axis;
        this.left = left;
        this.right = right;
    }
}

function buildKDTree(points, depth = 0) {
    if (points.length === 0) return null;

    const axis = depth % 2;
    points.sort((a, b) => a[axis] - b[axis]);
    const medianIndex = Math.floor(points.length / 2);
    const medianPoint = points[medianIndex];

    return new KDNode(
        medianPoint,
        axis,
        buildKDTree(points.slice(0, medianIndex), depth + 1),
        buildKDTree(points.slice(medianIndex + 1), depth + 1)
    );
}

function distanceSquared(point1, point2) {
    return (point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2;
}

function nearestNeighbor(node, target, depth = 0, best = null) {
    if (node === null) return best;

    const axis = depth % 2;
    const nextBest = best === null || distanceSquared(target, node.point) < distanceSquared(target, best.point) ? node : best;
    const nextDepth = depth + 1;

    let nextNode = null;
    let oppositeNode = null;

    if (target[axis] < node.point[axis]) {
        nextNode = node.left;
        oppositeNode = node.right;
    } else {
        nextNode = node.right;
        oppositeNode = node.left;
    }

    best = nearestNeighbor(nextNode, target, nextDepth, nextBest);

    if (distanceSquared(target, best.point) > (target[axis] - node.point[axis]) ** 2) {
        best = nearestNeighbor(oppositeNode, target, nextDepth, best);
    }

    return best;
}

function kNearestNeighbors(node, target, k, depth = 0, heap = []) {
    if (node === null) return heap;

    const axis = depth % 2;
    const distance = distanceSquared(target, node.point);

    if (heap.length < k) {
        heap.push({ node: node, distance: distance });
        heap.sort((a, b) => a.distance - b.distance);
    } else if (distance < heap[heap.length - 1].distance) {
        heap[heap.length - 1] = { node: node, distance: distance };
        heap.sort((a, b) => a.distance - b.distance);
    }

    const nextNode = target[axis] < node.point[axis] ? node.left : node.right;
    const oppositeNode = target[axis] < node.point[axis] ? node.right : node.left;

    heap = kNearestNeighbors(nextNode, target, k, depth + 1, heap);

    if (heap.length < k || Math.abs(target[axis] - node.point[axis]) ** 2 < heap[heap.length - 1].distance) {
        heap = kNearestNeighbors(oppositeNode, target, k, depth + 1, heap);
    }

    return heap;
}

const points = [
    [3, 6], [17, 15], [13, 15], [6, 12], [9, 1], [2, 7], [10, 19]
];
const kdTree = buildKDTree(points);
const queryPoint = [10, 5];

function drawPoints(ctx, points, color = 'blue') {
    ctx.fillStyle = color;
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0] * 40, 800 - point[1] * 40, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawTree(ctx, node, depth = 0, minX = 0, maxX = 20, minY = 0, maxY = 20) {
    if (!node) return;

    const axis = depth % 2;
    ctx.strokeStyle = 'black';

    if (axis === 0) {
        ctx.beginPath();
        ctx.moveTo(node.point[0] * 40, 800 - minY * 40);
        ctx.lineTo(node.point[0] * 40, 800 - maxY * 40);
        ctx.stroke();
        drawTree(ctx, node.left, depth + 1, minX, node.point[0], minY, maxY);
        drawTree(ctx, node.right, depth + 1, node.point[0], maxX, minY, maxY);
    } else {
        ctx.beginPath();
        ctx.moveTo(minX * 40, 800 - node.point[1] * 40);
        ctx.lineTo(maxX * 40, 800 - node.point[1] * 40);
        ctx.stroke();
        drawTree(ctx, node.left, depth + 1, minX, maxX, minY, node.point[1]);
        drawTree(ctx, node.right, depth + 1, minX, maxX, node.point[1], maxY);
    }
}

function initCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints(ctx, points);
    drawTree(ctx, kdTree);
}

document.getElementById('findNearest').addEventListener('click', () => {
    const nearest = nearestNeighbor(kdTree, queryPoint);
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(nearest.point[0] * 40, 800 - nearest.point[1] * 40, 5, 0, 2 * Math.PI);
    ctx.fill();
});

document.getElementById('findKNearest').addEventListener('click', () => {
    const k = parseInt(document.getElementById('kValue').value, 10);
    const kNearest = kNearestNeighbors(kdTree, queryPoint, k);
    const ctx = document.getElementById('canvas').getContext('2d');
    kNearest.forEach(result => {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(result.node.point[0] * 40, 800 - result.node.point[1] * 40, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
});

initCanvas();

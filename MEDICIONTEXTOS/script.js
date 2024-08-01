function levenshteinDistance(a, b) {
    const lenA = a.length;
    const lenB = b.length;
    const matrix = Array.from({ length: lenB + 1 }, () => Array(lenA + 1).fill(0));

    for (let i = 0; i <= lenB; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= lenA; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= lenB; i++) {
        for (let j = 1; j <= lenA; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Sustitución
                    matrix[i][j - 1] + 1,     // Inserción
                    matrix[i - 1][j] + 1      // Eliminación
                );
            }
        }
    }

    return matrix[lenB][lenA];
}

function calculateSimilarity() {
    const word1 = document.getElementById('word1').value.trim();
    const word2 = document.getElementById('word2').value.trim();
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    resultDiv.innerText = '';
    errorDiv.innerText = '';

    if (!word1 || !word2) {
        errorDiv.innerText = 'Por favor, ingresa ambas palabras.';
        return;
    }

    const distance = levenshteinDistance(word1, word2);
    resultDiv.innerText = `La distancia de Levenshtein entre "${word1}" y "${word2}" es ${distance}.`;
}

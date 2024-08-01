function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById(previewId);
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function calculateHistogram(imageData) {
    const histogram = { r: [], g: [], b: [] };
    for (let i = 0; i < 256; i++) {
        histogram.r[i] = 0;
        histogram.g[i] = 0;
        histogram.b[i] = 0;
    }

    for (let i = 0; i < imageData.data.length; i += 4) {
        histogram.r[imageData.data[i]]++;
        histogram.g[imageData.data[i + 1]]++;
        histogram.b[imageData.data[i + 2]]++;
    }

    return histogram;
}

function compareHistograms(hist1, hist2) {
    let sum = 0;
    for (let i = 0; i < 256; i++) {
        sum += Math.abs(hist1.r[i] - hist2.r[i]);
        sum += Math.abs(hist1.g[i] - hist2.g[i]);
        sum += Math.abs(hist1.b[i] - hist2.b[i]);
    }
    return sum;
}

function calculateSimilarity() {
    const img1 = document.getElementById('image1').files[0];
    const img2 = document.getElementById('image2').files[0];
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    resultDiv.innerText = '';
    errorDiv.innerText = '';

    if (!img1 || !img2) {
        errorDiv.innerText = 'Por favor, sube ambas imágenes.';
        return;
    }

    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    const imgElement1 = new Image();
    const imgElement2 = new Image();

    imgElement1.onload = () => {
        canvas1.width = imgElement1.width;
        canvas1.height = imgElement1.height;
        ctx1.drawImage(imgElement1, 0, 0);
        const imgData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);

        imgElement2.onload = () => {
            canvas2.width = imgElement2.width;
            canvas2.height = imgElement2.height;
            ctx2.drawImage(imgElement2, 0, 0);
            const imgData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

            const hist1 = calculateHistogram(imgData1);
            const hist2 = calculateHistogram(imgData2);

            const similarity = compareHistograms(hist1, hist2);
            resultDiv.innerText = `La similitud entre las imágenes es ${similarity}.`;
        };

        imgElement2.src = URL.createObjectURL(img2);
    };

    imgElement1.src = URL.createObjectURL(img1);
}

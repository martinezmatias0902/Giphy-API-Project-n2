const api_url = 'https://api.giphy.com/v1/gifs';
const api_key = 'QHWaY2sOQWWdbhyONNL87TJ5wWtPx5EA';
const endpoints = {
    upload: `https://upload.giphy.com/v1/gifs?api_key=${api_key}`
};
const getData = async endpoint => {
    try {
        const res = await fetch(endpoint)
        const data = await res.json()
        return data.data
    } catch (error) {
        console.log(error)
    }
}

const source = (imgId, gifId) => {
    document.getElementById(imgId).src = 'https://i.giphy.com/media/' + gifId + '/giphy.webp'
}

const getId = async (endpoint, imgId) => {
    try {
        const res = await fetch(endpoint)
        const data = await res.json()
        return source(imgId, data.data.id)
    } catch (error) {
        console.log(error)
    }
}
// a.addEventListener("click", async () => {
//     let blob = await recorder.getBlob();
//     const blobUrl = URL.createObjectURL(blob);
//     a.setAttribute("href", blobUrl);
// })

// Barra de Upload Gifs
let timer;

function nextStep(progressBar) {
    if (document.getElementById(progressBar).value >= 100) {
        document.getElementById(progressBar).value = 0;
    } else {
        document.getElementById(progressBar).value += 10;
    }
}

function startProgress() {
    timer = setInterval(function () {
        nextStep("dpBar");
    }, 1000);
}

function stopProgress() {
    clearInterval(timer);
}
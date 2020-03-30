document.addEventListener("DOMContentLoaded", async() => {
    const parte1 = document.getElementById("parte1");
    const parte2 = document.getElementById("parte2");
    const parte3 = document.getElementById("parte3");
    const parte4 = document.getElementById("parte4");
    const parte5 = document.getElementById("parte5");
    const contenedorUno = document.querySelector(".contenedorUno");
    const contenedorDos = document.querySelector(".contenedorDos");
    const contenedorSecundario = document.querySelector(".contenedorSecundario");
    const botonComenzar = document.getElementById("botonComenzar");
    const botonCapturar = document.getElementById("capturador");
    const botonListo = document.getElementById("startTimer");
    const repetirVideo = document.getElementById("repetir");
    const subirVideo = document.getElementById("stopTimer");
    const img = document.createElement("img");
    const video = document.getElementById("capturarVideo");
    const contenedorVideo = document.getElementById("contenedorVideo");
    let recorder = null;
    let blob = null;
    let timer;
    const api_url = 'https://api.giphy.com/v1/gifs';
    const api_key = 'QHWaY2sOQWWdbhyONNL87TJ5wWtPx5EA';
    const endpoints = { upload: `https://upload.giphy.com/v1/gifs?api_key=${api_key}` };


    function nextStep(progressBar) {
        if (document.getElementById(progressBar).value >= 100) {
            document.getElementById(progressBar).value = 0;
        } else {
            document.getElementById(progressBar).value += 10;
        }
    }

    function startProgress() {
        timer = setInterval(function() {
            nextStep("barraProgreso");
        }, 1000);
    }

    function stopProgress() {
        clearInterval(timer);
    }

    const getMedia = async() => {
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    height: {
                        max: 480
                    }
                },
                audio: false
            });
            return stream;
        } catch (err) {
            console.log("No se pudo acceder a la camara");
        }
    };

    const startRecord = async(recorder, container) => {
        let stream = await getMedia();
        container.srcObject = stream;
        container.play();
        recorder = new RecordRTCPromisesHandler(stream, {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
        });
        recorder.startRecording();
        return recorder;
    };

    const stopRecord = async(recorder, container) => {
        container.pause();
        container.srcObject = null;
        await recorder.stopRecording();
        let blob = await recorder.getBlob();
        pararVideo(blob);
        return blob;
    };

    const upload = async(endpoints, body) => {
        try {
            const res = await fetch(endpoints, {
                method: "POST",
                mode: "cors",
                body: body
            });
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    parte2.style.display = "none";
    parte3.style.display = "none";
    parte4.style.display = "none";
    parte5.style.display = "none";

    function start() {
        contenedorUno.classList.add("hide");
        contenedorDos.classList.remove("contenedorDos");
        contenedorDos.classList.add("show");
    }

    function afterCapturar() {
        parte1.style.display = "none";
        parte2.style.display = "flex";
        timerFuncional();
        document.getElementById("tituloContenedor").innerHTML = "Capturando tu Guifo";
    }

    function afterListo() {
        parte2.style.display = "none";
        parte3.style.display = "flex";
        timerFuncionalTwo()
        document.getElementById("tituloContenedor").innerHTML = "Vista Previa";
    }

    function volverInicio() {
        parte3.classList.remove("show");
        parte3.classList.add("hide");
        parte2.classList.remove("hide");
        parte2.classList.add("show");
        document.getElementById("tituloContenedor").innerHTML = "Un chequeo antes de empezar";
    }

    function afterSubir() {
        document.getElementById("tituloContenedor").innerHTML = "Subiendo Guifo";
        parte3.style.display = "none";
        parte4.style.display = "flex";
        parte5.style.display = "flex";
        contenedorVideo.classList.add("hide");
        document.getElementById("imagenCarga").classList.add("hide");
    }

    function subiendoGif() {
        window.setTimeout(() => {
            parte4.style.display = "none";
            parte5.style.display = "none";
            contenedorDos.style.display = "none"
            contenedorSecundario.style.display = "block"
        }, 10000);
    }

    function ocultarVideo() {
        video.classList.add("hide")
    }

    botonComenzar.addEventListener("click", async() => {
        start();
        recorder = await startRecord(recorder, video);
    });

    botonCapturar.addEventListener("click", afterCapturar);

    botonListo.addEventListener("click", async() => {
        ocultarVideo();
        startProgress();
        afterListo();
        await stopRecord(recorder, video);
    });

    repetirVideo.addEventListener("click", async() => {
        volverInicio();
        img.src = URL.revokeObjectURL(blob);
        img.style.display = "none";
        recorder = await startRecord(recorder, video);
    });

    subirVideo.addEventListener("click", async() => {
        stopProgress();
        afterSubir();
        subiendoGif();
        let blob = await recorder.getBlob();
        let response = await mandar(blob);
        const gif = await getData(`${api_url}/${response.id}?api_key=${api_key}`);
        mostrarGif(gif);
    });


    const organizarMisGifos = gifs => {
        let container = document.querySelector("#misGuifos");
        if (Array.isArray(gifs)) {
            for (let gif of gifs) {
                let img = document.createElement("img");
                img.setAttribute("width", "288");
                img.setAttribute("height", "298");
                img.src = gif.images.downsized.url;
                img.alt = gif.title;
                container.appendChild(img);
            }
        } else {
            let img = document.createElement("img");
            img.setAttribute("width", "288");
            img.setAttribute("height", "298");
            img.src = gifs.images.downsized.url;
            img.alt = gifs.title;
            container.appendChild(img);
        }
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

    const copiar = document.querySelector("#copiar")
    copiar.addEventListener("click", async() => {
        let input = document.createElement("input");
        let blob = await recorder.getBlob();
        console.log(blob)
        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl)
        input.setAttribute("value", blobUrl);
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    });

    const myGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
    const gifs = await getData(`${api_url}?api_key=${api_key}&ids=${myGifs}`);
    organizarMisGifos(gifs);

    const mandar = async blob => {
        const form = new FormData();
        form.append("file", blob, "myGifs.gif");
        console.log(form.get("file"));
        const response = await upload(endpoints.upload, form);
        const guifos = JSON.parse(localStorage.getItem("myGifs")) || [];
        console.log(guifos);
        const cambiarGifs = [...guifos, response.id];
        console.log(cambiarGifs);
        localStorage.setItem("myGifs", JSON.stringify(cambiarGifs));
        return response;
    };

    const pararVideo = blob => {
        img.src = URL.createObjectURL(blob);
        img.setAttribute("width", "100%");
        img.setAttribute("height", "480");
        img.setAttribute("id", "imagenCarga");
        contenedorVideo.appendChild(img);
    };

    const mostrarGif = gif => {
        let container = document.querySelector("#muestra");
        let img = document.createElement("img");
        img.setAttribute("width", "365");
        img.setAttribute("height", "191");
        img.src = gif.images.downsized.url;
        img.alt = gif.title;
        container.appendChild(img);
    };

    function timerFuncional() {
        const timerContainer = document.querySelector(".segundos");
        let timer = 0;
        const timerId = setInterval(function() {
            timer++;
            timerContainer.innerHTML = String(timer);
        }, 1000);

    }

    function timerFuncionalTwo() {
        const timerContainer = document.querySelector(".segundosTwo");
        let timer = 0;
        const timerId = setInterval(function() {
            timer++;
            timerContainer.innerHTML = String(timer);
        }, 1000);

    }
});
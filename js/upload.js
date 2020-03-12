

// Manipular DOM

document.addEventListener("DOMContentLoaded", async () => {
    const contenedorUno = document.querySelector("#contenedorUno")
    const contenedorDos = document.querySelector("#contenedorDos")
    const contenedorTres = document.querySelector("#contenedorTres")
    const contenedorCuatro = document.querySelector("#contenedorCuatro")
    const contenedorCinco = document.querySelector("#contenedorCinco")
    const contenedorSeis = document.querySelector("#contenedorSeis")
    const botonComenzar = document.getElementById("botonComenzar");
    const botonCapturar = document.getElementById("capturador");
    const botonListo = document.getElementById("startTimer");
    const repetirVideo = document.getElementById("repetir");
    const subirVideo = document.getElementById("stopTimer");
    const volverUno = document.getElementById("volverInicio");
    const img = document.createElement("img");
    const video = document.getElementById("capturarVideo");
    const contenedorVideo = document.getElementById("contenedorVideo");
    let recorder = null;
    let blob = null;


    // Ocultar contenedores

    // contenedorDos.style.display = "none";
    // contenedorTres.style.display = "none";
    // contenedorCuatro.style.display = "none";
    // contenedorCinco.style.display = "none";
    // contenedorSeis.style.display = "none";

    //Pasar de un container a otro

    botonComenzar.addEventListener("click", async () => {
        // contenedorUno.style.display = "none";
        // contenedorDos.style.display = "block";
    });
    botonCapturar.addEventListener("click", async () => {
        // contenedorDos.style.display = "none";
        // contenedorTres.style.display = "block";
        recorder = await startRecord(recorder, video);
    });
    botonListo.addEventListener("click", async () => {
        // contenedorTres.style.display = "none";
        // contenedorCuatro.style.display = "block";
        await stopRecord(recorder, video);
    });
    repetirVideo.addEventListener("click", async () => {
        // contenedorCuatro.style.display = "none";
        // contenedorTres.style.display = "block";
        img.src = URL.revokeObjectURL(blob);
        // img.style.display = "none";
        recorder = await startRecord(recorder, video);
    });
    subirVideo.addEventListener("click", async () => {
        let blob = await recorder.getBlob();
        let response = await mandar(blob);
        const gif = await getData(`${api_url}/${response.id}?api_key=${api_key}`);
        mostrarGif(gif);
        // contenedorCuatro.style.display = "none";
        // contenedorCinco.style.display = "block";
    });
    volverUno.addEventListener("click", async () => {
        // contenedorCinco.style.display = "none";
        // contenedorUno.style.display = "block";
    });

    //Poner gifs creados en contenedor
    const renderMyGifs = gifs => {
        let container = document.querySelector("#misGuifos");

        if (Array.isArray(gifs)) {
            for (let gif of gifs) {
                let img = document.createElement("img");
                img.setAttribute("width", "270");
                img.setAttribute("height", "270");
                img.src = gif.images.downsized.url;
                img.alt = gif.title;
                container.appendChild(img);
            }
        } else {
            let img = document.createElement("img");
            img.setAttribute("width", "270");
            img.setAttribute("height", "270");
            img.src = gifs.images.downsized.url;
            img.alt = gifs.title;
            container.appendChild(img);
        }
    };
    // muestra gifs grabados
    const myGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
    localStorage.setItem("myGifs", JSON.stringify(myGifs));
    const gifs = await getData(`${api_url}?api_key=${api_key}&ids=${myGifs}`);
    renderMyGifs(gifs);

    // Mostrar Video de la camara
    const getMedia = async () => {
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
            console.log("No se puede acceder a la cámara");
        }
    };
    //Funcion para grabar

    const startRecord = async (recorder, container) => {
        let stream = await getMedia();
        container.srcObject = stream;
        container.play();
        recorder = new RecordRTCPromisesHandler(stream, {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            // onGifRecordingStarted: function() {
            //     document.querySelector(".crear_titulo_2").innerHTML =
            //         "Capturando tu guifo";
            // }
        });
        recorder.startRecording();
        return recorder;
    };
    //Función dejar de grabar

    const stopRecord = async (recorder, container) => {
        // button_ready.style.display = "none";
        // button_ready_img.style.display = "none";
        // buttons_capture.style.display = "block";
        // cronometro.style.display = "none";
        // document.querySelector(".crear_titulo_2").innerHTML = "Vista previa";
        container.pause();
        container.srcObject = null;
        await recorder.stopRecording();
        let blob = await recorder.getBlob();
        pararVideo(blob);
        return blob;
    };
    const upload = async (endpoints, body) => {
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
    //Botón de copiar link
    const copiar = document.querySelector("#copiar")
    copiar.addEventListener("click", async () => {
        let input = document.createElement("input");
        let blob = await recorder.getBlob();
        const blobUrl = URL.createObjectURL(blob);
        input.setAttribute("value", blobUrl);
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    });
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
        const gif = await getData(`${api_url}?api_key=${api_key}&ids=${cambiarGifs}`);
        // renderMyGifs(gif);
        return response;
    };
    const pararVideo = blob => {
        // contenedorVideo.style.display = "none";
        img.src = URL.createObjectURL(blob);
        img.setAttribute("width", "832");
        img.setAttribute("height", "434");
        contenedorVideo.appendChild(img);

    };
    //Mostrar y renderizar el último gif
    const mostrarGif = gif => {
        let container = document.querySelector("#muestra");
        let img = document.createElement("img");
        img.setAttribute("width", "365");
        img.setAttribute("height", "191");
        img.src = gif.images.downsized.url;
        img.alt = gif.title;
        container.appendChild(img);
    };
  


});
document.addEventListener("DOMContentLoaded", async() => {

    const api_url = 'https://api.giphy.com/v1/gifs';
    const api_key = 'QHWaY2sOQWWdbhyONNL87TJ5wWtPx5EA';

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

    const myGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
    localStorage.setItem("myGifs", JSON.stringify(myGifs));
    const gifs = await getData(`${api_url}?api_key=${api_key}&ids=${myGifs}`);
    organizarMisGifos(gifs);

    function cambiarTema(sheet) {
        document.getElementById('pagestyle').setAttribute('href', sheet);
    }

    document.getElementById("botonSailor").addEventListener('click', () => {
        cambiarTema('css/styles.css')
        document.getElementById("miLogo").setAttribute('src', 'assets/gifOF_logo.png')
    });


    document.getElementById("boton5").addEventListener('click', () => {
        cambiarTema('css/stylesTwo.css')
        document.getElementById("miLogo").setAttribute('src', 'assets/gifOF_logo_dark.png')
    });

});
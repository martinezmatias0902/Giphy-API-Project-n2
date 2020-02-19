// window.scroll(0, 468 - -159)

async function buscar(busqueda){
    const url = 'https://api.giphy.com/v1/gifs/search?api_key=QHWaY2sOQWWdbhyONNL87TJ5wWtPx5EA&q='+busqueda+'&limit=4&offset=0&rating=G&lang=en'
    const respuesta = await fetch(url)
    const datos = await respuesta.json()
    console.log(datos)
    return datos
}
function queBuscar(){
    buscar(document.querySelector('#queBuscar').value)
}
async function resultado()
    await buscar
    resultado.then(function(resp) {
    console.log(resp.data[0].images)
    resp.data.map(gif => {
        let img = document.createElement('img');
        let titulo = document.createElement('p');
        let div = document.createElement('div');
        img.src = gif.images.fixed_height.url;
        titulo.innerHTML = gif.title;
        div.appendChild(titulo);
        div.appendChild(img);
        document.getElementById('resultado').appendChild(div)
    })
})
// -------------------------------
async function searchTrends() {
    const url = 'https://api.giphy.com/v1/gifs/trending?api_key=QHWaY2sOQWWdbhyONNL87TJ5wWtPx5EA&limit=4&rating=G';
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos
}
// const trends = searchTrends();
// trends.then(function(resp) {
//     // console.log(resp.data[0].images)
//     resp.data.map(gif => {
//         var img = document.createElement("img");
//         var titulo = document.createElement("p");
//         var div = document.createElement("div");
//         img.src = gif.images.fixed_height.url;
//         titulo.innerHTML = gif.title;  
//         div.appendChild(titulo);
//         div.appendChild(img);
//         document.getElementById("add-images").appendChild(div)
//     })
// })

// async function searchTrends() {
//     const url = 'https://api.giphy.com/v1/gifs/trending?api_key=kdFOwDT4ieXpQiNeUk4B1EhjZ0yt0Irt&limit=24&rating=G';
//     const answer = await fetch(url);
//     const data = await answer.json();
//     return data
// }
const trends = searchTrends();
trends.then(function(resp) {
    console.log(resp.data)
    //console.log(resp.data[0].images)
    resp.data.map(gif => {
        let divFather = document.getElementById("add-images")
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let title = document.createElement("figcaption");
        divFather.appendChild(figure)        
        figure.appendChild(img);
        figure.appendChild(title);
        img.setAttribute("src", gif.images.fixed_height_downsampled.url);
        //img.src = gif.images.fixed_height.url;        
        title.setAttribute('class', 'search-title')
        title.innerHTML = gif.title; 
    })
})
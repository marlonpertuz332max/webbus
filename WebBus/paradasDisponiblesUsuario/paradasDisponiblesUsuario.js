var mapa = L.map('mapa', {
    zoomControl: true
});

var marcadorBusqueda = null;
let marcadorTemp = null;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
}).addTo(mapa);


// marcador principal
var marcador = L.marker([10.9685, -74.7813]).addTo(mapa)
.bindPopup("Ubicación de ejemplo")
.openPopup();


// Paradas de bus
var paradas = [
    [10.9685,-74.7813],
    [10.9698,-74.7800],
    [10.9672,-74.7831],
    [10.9660,-74.7840],
    [10.9705,-74.7820]
];

paradas.forEach(function(parada){
    L.marker(parada).addTo(mapa)
    .bindPopup("Parada de bus cercana");
});


// Ubicacion del usuario
mapa.locate({
    setView: true,
    maxZoom: 18,
    enableHighAccuracy: true
});

function onLocationFound(e) {

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // centrar mapa en tu ubicación
    mapa.setView([lat, lng], 18);

    var iconoUsuario = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
        iconSize: [35,35],
        iconAnchor: [17,35]
    });

    L.marker([lat, lng], {icon: iconoUsuario}).addTo(mapa)
        .bindPopup("Estás aquí")
        .openPopup();

    L.circle([lat, lng], {
        radius: e.accuracy / 2,
        color: "#1E90FF",
        fillColor: "#1E90FF",
        fillOpacity: 0.3
    }).addTo(mapa);
}

function onLocationError() {
    alert("Activa la ubicación para ver tu posición en el mapa.");
}

mapa.on('locationerror', onLocationError);
mapa.on('locationfound', onLocationFound);

// Botón pantalla completa para el mapa

// Referencia al contenedor
const mapaContainer = document.querySelector('.mapa');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Si el navegador no soporta Fullscreen API, el fallback será usar una clase .fullscreen
const supportsFullscreen = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);

// Ocultar botón si no hay soporte x (opcional)
if (!supportsFullscreen) {
}

// Función para pedir fullscreen al elemento
function requestFullscreen(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API no soportada'));
}

// Función para salir de fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return Promise.reject(new Error('Fullscreen API no soportada'));
}

// Toggle fullscreen
function toggleFullscreen() {
    // si ya estamos en fullscreen
    const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    if (!isFS) {
        // intenta Fullscreen API en el contenedor .mapa
        requestFullscreen(mapaContainer).catch(function(){
            // fallback: si falla, añadimos clase fullscreen para simular
            mapaContainer.classList.add('fullscreen');  
            fullscreenBtn.classList.add('active');
            // fuerza redibujado del mapa
            setTimeout(function(){ mapa.invalidateSize(); }, 250);
        });
    } else {
        // salir
        exitFullscreen().catch(function(){
            // fallback: quitar clase
            mapaContainer.classList.remove('fullscreen');
            fullscreenBtn.classList.remove('active');
            setTimeout(function(){ mapa.invalidateSize(); }, 250);
        });
    }
}

// Si el usuario pulsa el botón
fullscreenBtn.addEventListener('click', function(){
    toggleFullscreen();
});

// Escuchar cambios reales de fullscreen para actualizar estilos y forzar invalidateSize
function onFullScreenChange(){
    const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (isFS) {
        mapaContainer.classList.add('fullscreen'); // opcional, para aplicar CSS
        fullscreenBtn.classList.add('active');
    } else {
        mapaContainer.classList.remove('fullscreen');
        fullscreenBtn.classList.remove('active');
    }
    // Leaflet necesita recalcular el tamaño cuando cambia el tamaño visible
    // damos un pequeño timeout para asegurarnos
    setTimeout(function(){
        mapa.invalidateSize();
    }, 200);
}

// attach event listeners cross-browser
document.addEventListener('fullscreenchange', onFullScreenChange);
document.addEventListener('webkitfullscreenchange', onFullScreenChange);
document.addEventListener('mozfullscreenchange', onFullScreenChange);
document.addEventListener('MSFullscreenChange', onFullScreenChange);

// Por si ya estás en fullscreen al cargar (poco probable)
onFullScreenChange();

// BUSCAR DIRECCION EN EL MAPA
const inputDireccion = document.getElementById("direccion");
const botonBuscar = document.getElementById("btnBuscar");
const listaDirecciones = document.getElementById("listaDirecciones");

botonBuscar.addEventListener("click", buscarDireccion);

async function buscarDireccion() {
    let direccion = inputDireccion.value.trim();
    if (!direccion) {
        alert("Escribe una dirección o lugar destacado.");
        return;
    }

    // Optimizar para direcciones colombianas (intersecciones)
    let query = direccion.replace(/\b(con|y|-)\b/gi, "&");

    // Primero intentamos buscarlo junto con Barranquilla
    try {
        const btnTexto = botonBuscar.innerText;
        botonBuscar.innerText = "...";
        
        let res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query + " Barranquilla")}&limit=1`);
        let data = await res.json();

        // Si falla en Barranquilla, intentamos en el área metropolitana (Soledad)
        if (!data.features || data.features.length === 0) {
            res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query + " Soledad")}&limit=1`);
            data = await res.json();
            
            // Si también falla, intentamos una búsqueda más relax sin municipio forzado pero centrado en BAQ
            if (!data.features || data.features.length === 0) {
                res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=10.9685&lon=-74.7813&limit=1`);
                data = await res.json();
            }
        }

        botonBuscar.innerText = btnTexto;

        if (!data.features || data.features.length === 0) {
            alert("No pudimos ubicar ese lugar exacto. Intenta usar sitios conocidos (Ej: Buena Vista, Portal del Prado) o intersecciones simples (Calle 72 con 46).");
            return;
        }

        // Photon devuelve coordenadas como [Longitud, Latitud]
        const lon = data.features[0].geometry.coordinates[0];
        const lat = data.features[0].geometry.coordinates[1];
        const nombreLugar = data.features[0].properties.name || direccion;

        mapa.flyTo([lat, lon], 17);

        if (marcadorBusqueda) {
            mapa.removeLayer(marcadorBusqueda);
        }

        marcadorBusqueda = L.marker([lat, lon]).addTo(mapa)
            .bindPopup(`📍 <b>${nombreLugar}</b><br><span style="font-size:12px;color:#666;">Haz clic para eliminar</span>`)
            .openPopup();

        marcadorBusqueda.on("click", function () {
            mapa.removeLayer(marcadorBusqueda);
            marcadorBusqueda = null;
        });

    } catch (error) {
        botonBuscar.innerText = "Buscar";
        alert("Error de conexión al buscar la dirección.");
        console.error(error);
    }
}

// Permitir buscar al presionar Enter en el input
inputDireccion.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        buscarDireccion();
    }
});

document.querySelectorAll(".parada").forEach(function(paradaHTML){

    const boton = paradaHTML.querySelector("button");

    boton.addEventListener("click", function(){

        const lat = paradaHTML.dataset.lat;
        const lon = paradaHTML.dataset.lon;

        mapa.flyTo([lat, lon], 17);

        if(marcadorTemp){
            mapa.removeLayer(marcadorTemp);
        }

        marcadorTemp = L.marker([lat, lon]).addTo(mapa)
        .bindPopup("📍 Parada seleccionada")
        .openPopup();

    });

});

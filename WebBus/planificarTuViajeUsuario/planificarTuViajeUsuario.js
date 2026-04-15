// ============================================================
// MAPA RESTRINGIDO A BARRANQUILLA Y SOLEDAD
// ============================================================

// Límites del área metropolitana: Barranquilla + Soledad
var limitesSur = [10.87, -75.00];   // Esquina suroeste (Soledad sur)
var limitesNorte = [11.05, -74.72]; // Esquina noreste (Barranquilla norte)
var boundsArea = L.latLngBounds(limitesSur, limitesNorte);

// INICIALIZAR MAPA con restricciones
var mapa = L.map('mapa', {
    maxBounds: boundsArea.pad(0.05),  // Pequeño margen extra
    maxBoundsViscosity: 1.0,           // No dejar salir del área
    minZoom: 12,                       // No permitir alejarse demasiado
    maxZoom: 18
}).setView([10.9685, -74.7813], 13);

// CAPA
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

// VARIABLES
var miLat = null;
var miLon = null;
var marcadorUsuario = null;
var controlRuta = null;
var marcadorOrigen = null;
var marcadorDestino = null;

// ICONO USUARIO
var iconoUsuario = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35]
});

// UBICACIÓN EN TIEMPO REAL
navigator.geolocation.watchPosition(function(pos) {

    miLat = pos.coords.latitude;
    miLon = pos.coords.longitude;

    mapa.setView([miLat, miLon], 16);

    if (marcadorUsuario) {
        marcadorUsuario.setLatLng([miLat, miLon]);
    } else {
        marcadorUsuario = L.marker([miLat, miLon], { icon: iconoUsuario })
            .addTo(mapa)
            .bindPopup("📍 Estás aquí")
            .openPopup();
    }

    // ACTUALIZAR RUTA EN TIEMPO REAL
    if(controlRuta){
        let destinoActual = controlRuta.getWaypoints()[1];

        if(destinoActual && destinoActual.latLng){
            controlRuta.setWaypoints([
                L.latLng(miLat, miLon),
                destinoActual.latLng
            ]);
        }
    }

}, function(error) {
    Swal.fire({
        icon: 'warning',
        title: 'Ubicación desactivada',
        text: 'Activa la ubicación para usar el mapa',
        confirmButtonColor: '#3b82f6'
    });
}, {
    enableHighAccuracy: true
});


// ESPERAR A QUE CARGUE TODO
window.onload = function(){

    document.querySelector("input[type='date']").min = new Date().toISOString().split("T")[0];

    const boton = document.getElementById("btnRuta");

    boton.addEventListener("click", function(){

        let origen = document.getElementById("origen").value.trim();
        let destino = document.getElementById("destino").value.trim();
        let tipo = document.getElementById("transporte")?.value || "driving";

        let fecha = document.querySelector("input[type='date']").value;
        let hora = document.querySelector("input[type='time']").value;

        let ahora = new Date();
        let fechaHoraUsuario = new Date(`${fecha}T${hora}`);
        
        if(!fecha || !hora){
            Swal.fire({
                icon: 'warning',
                title: 'Información incompleta',
                text: 'Debes seleccionar fecha y hora',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        //Si es en el pasado
        if(fechaHoraUsuario < ahora){
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'No puedes seleccionar una fecha u hora pasada',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        if(destino === ""){
            Swal.fire({
                icon: 'warning',
                title: 'Falta destino',
                text: 'Escribe un destino',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        // Mostrar loading con SweetAlert2
        Swal.fire({
            title: 'Buscando la mejor ruta...',
            text: 'Por favor espera un momento',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // función para buscar coordenadas SOLO en Barranquilla/Soledad
        function buscarLugar(lugar){
            // viewbox restringe la búsqueda al área de Barranquilla + Soledad
            // bounded=1 fuerza que los resultados estén dentro del viewbox
            var viewbox = '-75.00,10.87,-74.72,11.05';
            return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lugar)}, Barranquilla, Colombia&viewbox=${viewbox}&bounded=1&limit=1`)
            .then(res => res.json());
        }

        let promesas = [];

        // ORIGEN OPCIONAL
        if(origen === ""){
            if(miLat === null || miLon === null){
                Swal.fire({
                    icon: 'info',
                    title: 'Ubicación pendiente',
                    text: 'Esperando tu ubicación...',
                    confirmButtonColor: '#3b82f6'
                });
                return;
            }

            promesas.push(Promise.resolve([{lat: miLat, lon: miLon}]));
        } else {
            promesas.push(buscarLugar(origen));
        }

        // DESTINO
        promesas.push(buscarLugar(destino));

        Promise.all(promesas)
        .then(([dataOrigen, dataDestino]) => {

            if(dataOrigen.length === 0 || dataDestino.length === 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Dirección no encontrada',
                    text: 'Asegúrate de escribir bien la dirección en Barranquilla/Soledad',
                    confirmButtonColor: '#3b82f6'
                });
                return;
            }

            let latOrigen = dataOrigen[0].lat;
            let lonOrigen = dataOrigen[0].lon;

            let latDestino = dataDestino[0].lat;
            let lonDestino = dataDestino[0].lon;

            // eliminar ruta anterior
            if(controlRuta){
                mapa.removeControl(controlRuta);
            }

            // eliminar marcadores anteriores
            if(marcadorOrigen) mapa.removeLayer(marcadorOrigen);
            if(marcadorDestino) mapa.removeLayer(marcadorDestino);

            // marcadores
            marcadorOrigen = L.marker([latOrigen, lonOrigen])
                .addTo(mapa)
                .bindPopup("Origen");

            marcadorDestino = L.marker([latDestino, lonDestino])
                .addTo(mapa)
                .bindPopup("Destino");

            // CREAR RUTA
            controlRuta = L.Routing.control({
                waypoints: [
                    L.latLng(latOrigen, lonOrigen),
                    L.latLng(latDestino, lonDestino)
                ],

                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    profile: tipo
                }),

                lineOptions: {
                    styles: [{color: 'blue', weight: 5}]
                },

                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                show: false,

                createMarker: function() { return null; }

            }).addTo(mapa);

            // centrar mapa
            mapa.fitBounds([
                [latOrigen, lonOrigen],
                [latDestino, lonDestino]
            ]);

            // TIEMPO Y DISTANCIA
            controlRuta.on('routesfound', function(e){

                let ruta = e.routes[0];

                let tiempoSegundos = ruta.summary.totalTime;
                let distanciaMetros = ruta.summary.totalDistance;

                let minutos = Math.round(tiempoSegundos / 60);
                let km = (distanciaMetros / 1000).toFixed(2);

                document.getElementById("infoRuta").innerHTML =
                    `Tiempo: ${minutos} min <br>Distancia: ${km} km`;
                document.getElementById("infoRuta").style.display = "block";

                // Cerrar loading de SweetAlert2
                Swal.close();

                // Mostrar éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: '¡Ruta encontrada!',
                    html: `Distancia: <b>${km} km</b><br>Tiempo estimado: <b>${minutos} min</b>`,
                    timer: 3000,
                    showConfirmButton: false
                });

                // ESTO ES PARA GUARDAR EN EL HISTORIAL
                if (typeof guardarViaje === 'function') {
                    // Usar el valor ingresado de origen o "Mi ubicación"
                    const origenStr = origen !== "" ? origen : "Mi ubicación";
                    guardarViaje(origenStr, destino, `${km} km`, `${minutos} min`);
                }

            });

            // Si hay error en la ruta (no la encuentra)
            controlRuta.on('routingerror', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Ruta no encontrada',
                    text: 'No pudimos trazar una ruta entre estos puntos',
                    confirmButtonColor: '#3b82f6'
                });
            });

            // NOTIFICACIÓN
            programarNotificacion(fecha, hora, destino);

        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un problema al buscar la ubicación',
                confirmButtonColor: '#3b82f6'
            });
            console.error(error);
        });

    });

};


// FUNCIÓN NOTIFICACIÓN
function programarNotificacion(fecha, hora, destino){

    if(!fecha || !hora){
        return;
    }

    let fechaHoraViaje = new Date(`${fecha}T${hora}`);
    let ahora = new Date();

    let tiempoEspera = fechaHoraViaje - ahora;

    if(tiempoEspera <= 0){
        return;
    }

    Notification.requestPermission().then(permiso => {

        if(permiso === "granted"){

            setTimeout(() => {
                new Notification("Recordatorio de viaje", {
                    body: `Tu viaje hacia ${destino} es ahora`,
                    icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png"
                });
            }, tiempoEspera);

        }

    });
}


// FULLSCREEN
const btnFullscreen = document.getElementById("fullscreenBtn");
const contenedorMapa = document.querySelector(".mapa");

btnFullscreen.addEventListener("click", () => {
    contenedorMapa.classList.toggle("fullscreen");

    setTimeout(() => {
        mapa.invalidateSize();
    }, 300);
});

const inputFecha = document.querySelector("input[type='date']");
const inputHora = document.querySelector("input[type='time']");

inputFecha.addEventListener("change", () => {

    let hoy = new Date().toISOString().split("T")[0];

    if(inputFecha.value === hoy){

        let ahora = new Date();
        let horas = ahora.getHours().toString().padStart(2, '0');
        let minutos = ahora.getMinutes().toString().padStart(2, '0');

        inputHora.min = `${horas}:${minutos}`;

    } else {
        inputHora.min = "";
    }

});


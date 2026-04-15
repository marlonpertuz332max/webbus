// MAPA
var mapa = L.map('mapa').setView([10.9685, -74.7813], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(mapa);

// ICONO BUS
var iconoBus = L.icon({ 
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png", 
    iconSize: [40, 40], 
    iconAnchor: [20, 40], popupAnchor: [0, -40], 
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png", 
    shadowSize: [40, 40] 
});

// PUNTOS CLAVE
var rutaA1 = [
    [10.9700, -74.8000], // NEVADA NUEVA ESPERANZA
    [10.9650, -74.7950], // Diagonal 78
    [10.9600, -74.7900], // Transversal 2
    [10.9550, -74.7850], // Diagonal 71
    [10.9500, -74.7800], // Carrera 4
    [10.9550, -74.7750], // Calle 69
    [10.9600, -74.7700], // Carrera 5
    [10.9700, -74.7800], // Av Murillo
    [10.9750, -74.7900], // Retorno Granabastos
    [10.9800, -74.8000], // Circunvalar
    [11.0000, -74.8200], // Calle 107
    [10.9900, -74.8300], // Carrera 4Sur
    [10.9800, -74.8400], // Calle 91
    [10.9750, -74.8350], // Carrera 2
    [10.9700, -74.8300], // Calle 90
    [10.9750, -74.8250], // Carrera 2C
    [10.9850, -74.8200], // Calle 96
    [10.9900, -74.8150], // Carrera 4B
    [10.9600, -74.7900], // Av Cordialidad
    [10.9650, -74.7850], // Calle 38
    [10.9700, -74.7800], // Carrera 40
    [10.9750, -74.7750], // Calle 40
    [10.9700, -74.7700], // Carrera 31
    [10.9650, -74.7750], // Calle 39
    [10.9800, -74.8400], // Calle 91
    [10.9850, -74.8200], // Carrera 4B
    [10.9700, -74.8300], // Calle 90
    [10.9750, -74.8350], // Carrera 2
    [10.9800, -74.8400], // Calle 91
    [10.9900, -74.8300], // Carrera 4Sur
    [11.0000, -74.8200], // Calle 107
    [10.9800, -74.8000], // Circunvalar
    [10.9850, -74.8050], // Retorno Puente Cordialidad
    [10.9900, -74.8000], // Puerta Dorada
    [10.9700, -74.7800], // Av Murillo
    [10.9600, -74.7700], // Carrera 5
    [10.9550, -74.7750], // Calle 69
    [10.9500, -74.7800], // Carrera 4
    [10.9550, -74.7850], // Diagonal 71
    [10.9600, -74.7900], // Transversal 2
    [10.9650, -74.7950], // Diagonal 78
    [10.9700, -74.8000]  // NEVADA
];

// RUTA REAL
var controlRuta = L.Routing.control({
    waypoints: rutaA1.map(p => L.latLng(p[0], p[1])),

    lineOptions: {
        styles: [{color: 'blue', weight: 6}]
    },

    addWaypoints: false,
    draggableWaypoints: false,
    routeWhileDragging: false,

    show: false, 
    createMarker: () => null

}).addTo(mapa);

// CUANDO YA EXISTE LA RUTA
controlRuta.on('routesfound', function(e){

    let rutaReal = e.routes[0].coordinates;

    // ajustar vista correctamente
    let bounds = L.latLngBounds(rutaReal);
    mapa.fitBounds(bounds);

    iniciarAnimacion(rutaReal);
});

// ANIMACIÓN SUAVE REAL
function iniciarAnimacion(ruta){

    function crearBus(posInicial, velocidad){
        return {
            marker: L.marker(posInicial, {icon: iconoBus}).addTo(mapa),
            index: 0,
            progreso: 0,
            velocidad: velocidad
        };
    }

    var buses = [
        crearBus(ruta[0], 0.0005),
        crearBus(ruta[80], 0.0007),
        crearBus(ruta[160], 0.0006)
    ];

    function distancia(a, b){
        let dx = a.lat - b.lat;
        let dy = a.lng - b.lng;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function animar(){

        buses.forEach(bus => {

            let actual = ruta[bus.index];
            let siguiente = ruta[bus.index + 1];

            if(!siguiente){
                bus.index = 0;
                bus.progreso = 0;
                return;
            }

            bus.progreso += bus.velocidad;

            let lat = actual.lat + (siguiente.lat - actual.lat) * bus.progreso;
            let lon = actual.lng + (siguiente.lng - actual.lng) * bus.progreso;

            bus.marker.setLatLng([lat, lon]);

            if(bus.progreso >= 1){
                bus.index++;
                bus.progreso = 0;
            }

        });
        requestAnimationFrame(animar);
    }

    animar();
}

// UBICACIÓN EN TIEMPO REAL
var marcadorUsuario = null;

if (navigator.geolocation) {

    navigator.geolocation.watchPosition(
        function(posicion) {

            let lat = posicion.coords.latitude;
            let lon = posicion.coords.longitude;

            // Si ya existe, lo movemos
            if (marcadorUsuario) {
                marcadorUsuario.setLatLng([lat, lon]);
            } else {
                // Si no existe, lo creamos
                marcadorUsuario = L.marker([lat, lon], {
                    icon: L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                        iconSize: [35, 35]
                    })
                }).addTo(mapa)
                  .bindPopup("📍 Estás aquí")
                  .openPopup();
            }

        },
        function(error) {
            console.log("Error obteniendo ubicación:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );

} else {
    alert("Tu navegador no soporta geolocalización");
}


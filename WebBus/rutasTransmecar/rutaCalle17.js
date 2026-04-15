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
    [10.8850, -74.7800],
    [10.8900, -74.7700],
    [10.9000, -74.7550], // zona Carrera 1 / Calle 5A
    [10.9100, -74.7450], // Calle 10
    [10.9200, -74.7350], // Calle 11E
    [10.9300, -74.7250], // Calle 12
    [10.9350, -74.7200], // Carrera 8
    [10.9400, -74.7250], // Calle 11
    [10.9450, -74.7350], // Vía Oriental (Soledad)
    [10.9500, -74.7500], // Autopista Aeropuerto
    [10.9550, -74.7600], // La Virgencita
    [10.9600, -74.7700], // Calle 18
    [10.9600, -74.7800], // Calle 17
    [10.9650, -74.7900], // Carrera 38
    [10.9680, -74.7800], // Calle 32
    [10.9700, -74.7750], // Carrera 40
    [10.9720, -74.7700], // Calle 37
    [10.9700, -74.7800], // Carrera 38 regreso
    [10.9750, -74.7850], // Calle 50
    [10.9800, -74.7900], // Carrera 45
    [10.9850, -74.7950], // Calle 53
    [10.9755, -74.7900], // Carrera 54
    [10.9820, -74.7850], // Calle 64
    [10.9850, -74.7800], // Carrera 58
    [10.9900, -74.7750], // Calle 77
    [10.9880, -74.7850], // Vía 40
    [10.9850, -74.7900], // Calle 75
    [10.9820, -74.7950], // Carrera 62
    [10.9800, -74.8000], // Calle 76
    [10.9780, -74.7850], // Carrera 58 regreso
    [10.9750, -74.7900], // Parque Los Fundadores
    [10.9755, -74.7900], // Carrera 54
    [10.9700, -74.7850], // Calle 54
    [10.9680, -74.7800], // Carrera 41
    [10.9650, -74.7750], // Calle 40
    [10.9680, -74.7800], // Carrera 40
    [10.9620, -74.7850], // Calle 33
    [10.9650, -74.7900], // Carrera 38
    [10.9600, -74.7800], // Calle 17
    [10.9600, -74.7700], // Calle 18
    [10.9650, -74.7800], // Carrera 19
    [10.9500, -74.7500], // Autopista Aeropuerto
    [10.9000, -74.7550],// REGRESO MALAMBO
    [10.8900, -74.7700],// REGRESO MALAMBO
    [10.8850, -74.7800]// CIERRE
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


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
    [10.9900, -74.8200], // NEVADA
    [10.9700, -74.7900], // Terminal
    [10.9750, -74.7900], // Carrera 15
    [10.9750, -74.7800], // Av Murillo
    [10.9650, -74.7750], // Carrera 13
    [10.9750, -74.7700], // Calle 72
    [10.9700, -74.7680], // Cra 12D
    [10.9800, -74.7650], // Calle 75
    [10.9700, -74.7700], // Cra 12A
    [10.9600, -74.7750], // Calle 56
    [10.9550, -74.7800], // Cra 9D
    [10.9500, -74.7850], // Calle 54
    [10.9450, -74.7900], // Cra 8
    [10.9500, -74.7950], // Calle 52
    [10.9550, -74.7900], // Cra 11
    [10.9600, -74.7850], // Calle 43
    [10.9650, -74.7800], // Cra 14
    [10.9600, -74.7750], // Calle 41
    [10.9700, -74.7600], // Carrera 17
    [10.9800, -74.7500], // Autopista aeropuerto
    [10.9850, -74.7450], // Carrera 19
    [10.9900, -74.7500], // Calle 21
    [10.9850, -74.7550], // Carrera 16
    [10.9800, -74.7600], // Calle 18
    [10.9600, -74.7800], // Calle 17
    [10.9650, -74.7900], // Carrera 38
    [10.9600, -74.7900], // Calle 30
    [10.9650, -74.7950], // Intendencia Fluvial
    [10.9750, -74.7900], // Vía 40
    [10.9780, -74.7850], // Calle 58
    [10.9755, -74.7900], // Carrera 54
    [10.9900, -74.7800], // Calle 75
    [11.0000, -74.7800], // Carrera 60
    [11.0100, -74.7850], // Paraíso
    [11.0200, -74.7900], // Carrera 65
    [11.0250, -74.7950], // Calle 84
    [11.0300, -74.8000], // Carrera 71
    [11.0350, -74.8050], // Calle 98
    [11.0000, -74.7700], // Carrera 51B
    [11.0100, -74.7600], // Circunvalar
    [11.0200, -74.7500], // Alameda del Río
    [11.0250, -74.7450], // Calle 112
    [11.0200, -74.7400], // Carrera 43B
    [11.0250, -74.7350], // Calle 114
    [11.0200, -74.7300], // Carrera 43
    [11.0150, -74.7350], // Calle 112
    [11.0100, -74.7400], // Carrera 42
    [11.0150, -74.7600], // Circunvalar
    [11.0000, -74.7700], // Carrera 53
    [10.9950, -74.7750], // Calle 100
    [10.9900, -74.7800], // Carrera 55
    [10.9850, -74.7850], // Calle 99A
    [10.9800, -74.7900], // Carrera 56
    [11.0200, -74.8000], // Carrera 71
    [11.0150, -74.8050], // Calle 92
    [11.0100, -74.8100], // Carrera 75A
    [11.0050, -74.8050], // Calle 89
    [11.0000, -74.8000], // Carrera 76
    [10.9780, -74.7850], // Calle 58
    [10.9750, -74.7800], // Univ Simón Bolívar
    [10.9700, -74.7750], // Calle 59
    [10.9650, -74.7700], // Carrera 47
    [10.9600, -74.7650], // Centro INCA
    [10.9550, -74.7700], // Carrera 50
    [10.9600, -74.7800], // Calle 37
    [10.9650, -74.7900], // Carrera 38
    [10.9600, -74.7900], // Calle 30
    [10.9550, -74.7800], // Soledad 2000
    [10.9600, -74.7750], // Carrera 17
    [10.9650, -74.7800], // Calle 41
    [10.9700, -74.7850], // Carrera 14
    [10.9500, -74.7850], // Calle 52
    [10.9550, -74.7800], // Carrera 8
    [10.9500, -74.7850], // Calle 54
    [10.9550, -74.7800], // Carrera 9D
    [10.9600, -74.7750], // Calle 56
    [10.9700, -74.7700], // Carrera 12
    [10.9750, -74.7800], // Murillo
    [10.9700, -74.7900], // Terminal
    [10.9900, -74.8200]  // NEVADA
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

// 🚀 ANIMACIÓN SUAVE REAL
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

// 📍 UBICACIÓN EN TIEMPO REAL
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


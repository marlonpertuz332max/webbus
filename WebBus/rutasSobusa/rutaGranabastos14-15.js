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
    [10.9900, -74.8200],// NEVADA
    [10.9800, -74.8000], // Granabastos
    [10.9750, -74.7900], // Av Murillo
    [10.9700, -74.7800], // Circunvalar
    [10.9650, -74.7700], // Simón Bolívar
    [10.9600, -74.7800], // Calle 17
    [10.9550, -74.7850], // Cra 15
    [10.9600, -74.7900], // Calle 30
    [10.9650, -74.7800], // Cra 14
    [10.9700, -74.7750], // Calle 60
    [10.9750, -74.7700], // Cra 20
    [10.9800, -74.7750], // Calle 53D
    [10.9850, -74.7800], // Cra 25
    [10.9900, -74.7850], // Calle 57
    [10.9950, -74.7900], // Cra 27
    [11.0000, -74.7950], // Calle 74B
    [11.0050, -74.8000], // Cra 26C7
    [11.0100, -74.8050], // Calle 79A
    [11.0150, -74.8000], // Cra 33
    [11.0200, -74.7950], // Calle 76
    [11.0250, -74.7900], // Cra 42F
    [11.0300, -74.7850], // Calle 79
    [11.0350, -74.7800], // Cra 43
    [11.0400, -74.7750], // Calle 93
    [11.0450, -74.7700], // Hotel Movich
    [11.0480, -74.7650], // Calle 94
    [11.0500, -74.7600], // Cra 53
    [11.0520, -74.7550], // Calle 98
    [11.0480, -74.7500], // Cra 51B
    [11.0450, -74.7400], // Corredor universitario
    [11.0400, -74.7300], // La Playa
    [11.0350, -74.7350], // Calle 14
    [11.0300, -74.7400], // Cra 10
    [11.0250, -74.7450], // Adelita de Char
    [11.0200, -74.7500], // Calle 22
    [11.0150, -74.7550], // Cra 20
    [11.0100, -74.7500], // Calle 20
    [11.0050, -74.7450], // Cra 17C
    [11.0000, -74.7400], // Calle 19
    [10.9950, -74.7350], // Cra 13
    [10.9900, -74.7400], // Calle 17
    [10.9850, -74.7450], // Cra 10
    [10.9800, -74.7500], // Calle 14
    [11.0450, -74.7400], // Corredor universitario
    [11.0480, -74.7500], // Cra 51B
    [11.0500, -74.7600], // Calle 96
    [11.0450, -74.7700], // Cra 47
    [11.0400, -74.7750], // Calle 93
    [11.0350, -74.7800], // Cra 49C
    [11.0300, -74.7850], // Calle 82
    [11.0250, -74.7900], // Cra 42F
    [11.0200, -74.7950], // Calle 76
    [11.0150, -74.8000], // Cra 38
    [11.0100, -74.8050], // Calle 79A
    [11.0050, -74.8000], // Cra 26C7
    [11.0000, -74.7950], // Calle 74
    [10.9950, -74.7900], // Cra 27
    [10.9900, -74.7850], // Calle 57
    [10.9850, -74.7800], // Cra 25
    [10.9800, -74.7750], // Calle 53D
    [10.9750, -74.7700], // Cra 20
    [10.9700, -74.7750], // Calle 60
    [10.9650, -74.7800], // Cra 14
    [10.9600, -74.7900], // Calle 30
    [10.9550, -74.7850], // Cra 15
    [10.9600, -74.7800], // Calle 17
    [10.9650, -74.7700], // Simón Bolívar
    [10.9700, -74.7800], // Circunvalar
    [10.9750, -74.7900], // Murillo
    [10.9800, -74.8000], // Granabastos
    [10.9900, -74.8200]  // Nevada
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


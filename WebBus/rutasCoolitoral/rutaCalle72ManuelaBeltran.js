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
    [10.9730, -74.7964], // Nevada Villa Adela
    [10.9700, -74.7900], // Manuela Beltrán
    [10.9655, -74.7800], // Autopista al Aeropuerto
    [10.9685, -74.7813], // Barranquilla centro
    [10.9705, -74.7480], // Calle 30
    [10.9680, -74.7420], // Malecón de Rebolo
    [10.9655, -74.7380], // Carrera 23
    [10.9665, -74.7440], // Calle 30 (otro tramo)
    [10.9680, -74.7475], // Carrera 22
    [10.9710, -74.7520], // Calle 38
    [10.9730, -74.7550], // Carrera 21
    [10.9750, -74.7580], // Colegio Sofía Camargo
    [10.9800, -74.7605], // Calle 70C
    [10.9850, -74.7625], // Carrera 27
    [10.9885, -74.7655], // Calle 71
    [10.9920, -74.7700], // Carrera 35B
    [10.9955, -74.7750], // Calle 72
    [10.9900, -74.7850], // Vía 40
    [10.9855, -74.7900], // Parque Cultural
    [10.9650, -74.7950]  // Soledad
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

    show: false, // ✅ ESTO ES CLAVE
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


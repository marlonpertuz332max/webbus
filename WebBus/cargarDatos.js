// Script para cargar datos de la base de datos

async function cargarRutas() {
    try {
        const response = await fetch('api/get-rutas.php');
        const datos = await response.json();
        
        if (datos.success && datos.rutas) {
            const selectRutas = document.getElementById('select-rutas');
            if (selectRutas) {
                selectRutas.innerHTML = '<option value="">Selecciona una ruta</option>';
                datos.rutas.forEach(ruta => {
                    const option = document.createElement('option');
                    option.value = ruta.id_ruta;
                    option.textContent = `${ruta.nombre_ruta} (${ruta.origen} → ${ruta.destino})`;
                    selectRutas.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error cargando rutas:', error);
    }
}

async function cargarParadas() {
    try {
        const response = await fetch('api/get-paradas.php');
        const datos = await response.json();
        
        if (datos.success && datos.paradas) {
            const selectParadas = document.getElementById('select-paradas');
            if (selectParadas) {
                selectParadas.innerHTML = '<option value="">Selecciona una parada</option>';
                datos.paradas.forEach(parada => {
                    const option = document.createElement('option');
                    option.value = parada.id_parada;
                    option.textContent = `${parada.nombre_parada} (${parada.latitud}, ${parada.longitud})`;
                    selectParadas.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error cargando paradas:', error);
    }
}

async function cargarBuses() {
    try {
        const response = await fetch('api/get-buses.php');
        const datos = await response.json();
        
        if (datos.success && datos.buses) {
            const selectBuses = document.getElementById('select-buses');
            if (selectBuses) {
                selectBuses.innerHTML = '<option value="">Selecciona un bus</option>';
                datos.buses.forEach(bus => {
                    const option = document.createElement('option');
                    option.value = bus.id_bus;
                    option.textContent = `${bus.numero_bus} - Placa: ${bus.placa} (Cap: ${bus.capacidad})`;
                    selectBuses.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error cargando buses:', error);
    }
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarRutas();
    cargarParadas();
    cargarBuses();
});

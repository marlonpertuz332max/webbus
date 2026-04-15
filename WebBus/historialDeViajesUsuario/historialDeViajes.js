// ============================================
// HISTORIAL DE VIAJES - WebBus
// ============================================

const HISTORIAL_KEY = 'webbus_historial';

document.addEventListener('DOMContentLoaded', function () {
    cargarHistorial();
});

// ─── Cargar y renderizar historial ────────────────────────────
function cargarHistorial() {
    const container = document.getElementById('historial-container');
    if (!container) return;

    const historial = obtenerHistorial();

    if (historial.length === 0) {
        container.innerHTML = `
            <div class="hist-empty">
                <div class="hist-empty-icon">🕐</div>
                <h3>Tu historial está vacío</h3>
                <p>Aquí aparecerán todos los viajes que planifiques con WebBus.</p>
                <a href="../busesDisponible/busesDisponible.html" class="wb-btn wb-btn-primary hist-cta-btn">
                    Ver rutas disponibles
                </a>
            </div>`;
        return;
    }

    let html = `
        <div class="hist-header-bar">
            <span class="hist-count">${historial.length} viaje${historial.length !== 1 ? 's' : ''} registrado${historial.length !== 1 ? 's' : ''}</span>
            <button class="wb-btn wb-btn-ghost wb-btn-sm hist-clear-btn" id="btnLimpiarHistorial">
                🗑️ Limpiar historial
            </button>
        </div>
        <div class="hist-list">`;

    historial.slice().reverse().forEach(function (viaje, idx) {
        const fecha = new Date(viaje.timestamp);
        const fechaStr = fecha.toLocaleDateString('es-CO', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
        const horaStr = fecha.toLocaleTimeString('es-CO', {
            hour: '2-digit', minute: '2-digit'
        });

        html += `
            <div class="hist-item" style="animation: wb-fadeInUp 0.4s ease-out ${idx * 0.06}s both">
                <div class="hist-item-icon">🚌</div>
                <div class="hist-item-info">
                    <h4>
                        <span class="hist-origin">${viaje.origen || 'Mi ubicación'}</span>
                        <span class="hist-arrow"> → </span>
                        <span class="hist-dest">${viaje.destino}</span>
                    </h4>
                    <p>
                        📅 ${fechaStr} &nbsp;·&nbsp; ⏰ ${horaStr}
                        ${viaje.distancia ? `&nbsp;·&nbsp; 📍 ${viaje.distancia}` : ''}
                        ${viaje.tiempo ? `&nbsp;·&nbsp; ⏱️ ${viaje.tiempo}` : ''}
                    </p>
                </div>
                <button class="hist-delete-btn" onclick="eliminarViaje(${viaje.id})" title="Eliminar">✕</button>
            </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

    const btnLimpiar = document.getElementById('btnLimpiarHistorial');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function () {
            if (confirm('¿Seguro que deseas limpiar todo el historial?')) {
                localStorage.removeItem(HISTORIAL_KEY);
                cargarHistorial();
            }
        });
    }
}

// ─── Obtener historial del localStorage ───────────────────────
function obtenerHistorial() {
    try {
        return JSON.parse(localStorage.getItem(HISTORIAL_KEY)) || [];
    } catch (e) {
        return [];
    }
}

// ─── Guardar un viaje (llamado desde planificarTuViajeUsuario.js) ──
function guardarViaje(origen, destino, distancia, tiempo) {
    const historial = obtenerHistorial();
    const nuevoViaje = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        origen: origen || '',
        destino: destino,
        distancia: distancia || '',
        tiempo: tiempo || ''
    };
    historial.push(nuevoViaje);
    if (historial.length > 50) historial.shift();
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
}

// ─── Eliminar un viaje específico ─────────────────────────────
function eliminarViaje(id) {
    let historial = obtenerHistorial();
    historial = historial.filter(function (v) { return v.id !== id; });
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
    cargarHistorial();
}

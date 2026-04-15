let rutas = JSON.parse(localStorage.getItem("rutas")) || [
  { id: "Sobusa", nombre: "Vivero Paraiso", estado: "normal" },
  { id: "Transmecar", nombre: "Calle 17", estado: "retraso" },
  { id: "Coolitoral", nombre: "Calle 17 - Universidades - Circunvalar", estado: "suspendido" },
  { id: "Boston Boston", nombre: "Futuro Express", estado: "normal" },
  { id: "Coochofal", nombre: "K8-Carrizal", estado: "normal" }
];

function mostrarRutas(){
    const contenedor = document.getElementById("rutas");
    contenedor.innerHTML = "";

    rutas.forEach(r => {
        let texto = "";
        if(r.estado === "normal") texto = "Operando con normalidad";
        if(r.estado === "retraso") texto = "Servicio con retrasos";
        if(r.estado === "suspendido") texto = "Suspendido";

        const div = document.createElement("div");
        div.className = "ruta";

        div.innerHTML = `
            <div>
                <strong>${r.id}</strong> - ${r.nombre}
            </div>
            <div class="estado ${r.estado}">
                ${texto}
            </div>
        `;

        contenedor.appendChild(div);
    });
}

function actualizarHora(){
    document.getElementById("hora").innerText = new Date().toLocaleTimeString();
    
    // Simular que el estado de las rutas cambia en tiempo real para mayor interacción
    const estadosPosibles = ["normal", "normal", "normal", "retraso", "suspendido"];
    
    rutas.forEach(r => {
        // 30% de probabilidad de cambiar el estado al actualizar
        if (Math.random() > 0.7) {
            r.estado = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];
        }
    });
    
    localStorage.setItem("rutas", JSON.stringify(rutas));
    mostrarRutas();
}

actualizarHora();
// Ya mostrarRutas() es llamado dentro de actualizarHora(), así que omitimos el duplicado.
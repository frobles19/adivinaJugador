import jugadores from './data/jugadores.js';

window.onload = function() {
    console.log('La página cargo correctamente.');

    // Seleccionamos el jugador al azar.
    let jugador = seleccionarJugador();
    // Generamos la lista de pistas.
    const pistasDisponibles = cargarPistas(jugador);

    revelarPista(jugador, pistasDisponibles);
    
    console.log(jugador);
    console.log(pistasDisponibles);

    // Lista de eventos para botones.
    document.getElementById("pedir-pista").addEventListener("click", function () {
        revelarPista(jugador, pistasDisponibles);
    });
    document.getElementById("respuesta").addEventListener("input", function () {
        actualizarSugerencias(jugadores, this.value);
    });
    document.getElementById("respuesta").addEventListener("change", function () {
        verificarRespuesta(this.value, jugador, pistasDisponibles);
    });

}

function seleccionarJugador() {
    return jugadores[Math.floor(Math.random() * jugadores.length)];
}

function cargarPistas(jugador) {
    const pistasDisponibles = ["nacionalidad", "posicion", "debut"];
    jugador.equipos.forEach((_, i) => {
        pistasDisponibles.push(`equipo-${i}`);
    });

    return pistasDisponibles;
}

function revelarPista(jugador, pistasDisponibles) {
// Seleccionamos aleatoriamente una pista de las disponibles.
    const indice = Math.floor(Math.random() * pistasDisponibles.length);
    const pista = pistasDisponibles.splice(indice, 1)[0];

    // evaluamos que tipo de pista fue seleccionada.
    switch (pista) {
        case "nacionalidad":
            document.getElementById("nacionalidad").textContent = jugador.nacionalidad;
            break;
        case "posicion":
            document.getElementById("posicion").textContent = jugador.posicion;
            break;
        case "debut":
            document.getElementById("debut").textContent = jugador.anioDebut;
            break;
        default:
            // Si se seleciono un equipo.
            if (pista.startsWith("equipo-")) {
                const index = parseInt(pista.split("-")[1]);
                const nombreEquipo = jugador.equipos[index];
                const urlEscudo = `data/img/escudos/escudo-${nombreEquipo}.jpg`;

                const escudos = document.querySelectorAll(".escudo-equipo");
                for (let escudo of escudos) {
                    const fondo = getComputedStyle(escudo).backgroundImage;
                    if (fondo.includes("icono-generico.png")) {
                        escudo.style.backgroundImage = `url("${urlEscudo}")`;
                        break;
                    }
                }
            }
            break;
    }

    // Verificamos si quedan pistas disponibles.
    if (pistasDisponibles.length === 0) {
        document.getElementById("pedir-pista").disabled = true;
        document.getElementById("respuesta").disabled = true;
    }
}

function actualizarSugerencias(jugadores, texto) {
    const datalist = document.getElementById("sugerencias");
    // Limpiar sugerencias anteriores
    datalist.innerHTML = "";

    // No mostrar sugerencias hasta que se hayan escrito tres caracteres.
    if (texto.length < 3) return;

    // Evaluamos si lo escrito esta incluido en los nombres.
    const coincidencias = jugadores.filter(j =>
        j.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    // Mostramos las coincidencias.
    coincidencias.forEach(j => {
        const option = document.createElement("option");
        option.value = j.nombre;
        datalist.appendChild(option);
    });
}

function verificarRespuesta(nombreIngresado, jugador, pistasDisponibles) {
    // Asigna en variables a la respuesta del jugador y la respuesta correcta.
    const respuesta = nombreIngresado.trim().toLowerCase();
    const nombreCorrecto = jugador.nombre.toLowerCase();

    // Valida la respuesta del jugador.
    if (respuesta === nombreCorrecto) {
        document.getElementById("pedir-pista").disabled = true;
        document.getElementById("respuesta").disabled = true;
    } else {
        console.log("❌ No es correcto. Seguí intentando.");
        revelarPista(jugador, pistasDisponibles);
    }
}

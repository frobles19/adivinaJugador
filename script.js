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
            if (pista.startsWith("equipo-")) {
                const index = parseInt(pista.split("-")[1]);
                const nombreEquipo = jugador.equipos[index];
                const urlEscudo = `data/img/escudos/escudo-${nombreEquipo}.jpg`;

                const cartas = document.querySelectorAll(".carta-equipo");

                for (let carta of cartas) {
                    if (!carta.classList.contains("flip")) {
                        const dorso = carta.querySelector(".carta-dorso");
                        dorso.style.backgroundImage = `url("${urlEscudo}")`;
                        carta.classList.add("flip");
                        break;
                    }
                }
            }
            break;
    }

    // Verificamos si quedan pistas disponibles.
    if (pistasDisponibles.length === 0) {
        document.getElementById("pedir-pista").disabled = true;
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

    const botonPista = document.getElementById("pedir-pista");
    const inputJugador = document.getElementById("respuesta");

    // Valida la respuesta del jugador.
    if (respuesta === nombreCorrecto) {
        revelarJugador(jugador);
        botonPista.disabled = true;
        inputJugador.disabled = true;
    } else {
        if (pistasDisponibles.length === 0){
            revelarJugador(jugador);
            inputJugador.disabled = true;
        } else {
            revelarPista(jugador, pistasDisponibles);
            inputJugador.value = "";
        }
    }
}

function revelarJugador(jugador) {
    const contenedor = document.querySelector(".icono-jugador");
    const dorso = contenedor.querySelector(".icono-dorso");

    const nombreFormateado = jugador.nombre.toLowerCase().replace(/\s+/g, "-");
    const urlImagen = `data/img/jugadores/${nombreFormateado}.jpg`;

    dorso.style.backgroundImage = `url("${urlImagen}")`;
    contenedor.classList.add("flip");

    const inputJugador = document.getElementById("respuesta");
    inputJugador.value = `${jugador.nombre}`;
}

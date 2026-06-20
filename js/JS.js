document.addEventListener("DOMContentLoaded", () => {
    // === ELEMENTOS DEL DOM ===
    const botonesDificultad = document.querySelectorAll(".btn-dif");
    const btnIniciar = document.getElementById("btn-iniciar");
    const btnComprobar = document.getElementById("btn-comprobar");
    const palabraPantalla = document.getElementById("palabra-pantalla");
    const palabraUsuario = document.getElementById("palabra-usuario");
    const contadorAciertos = document.getElementById("contador-aciertos");
    const contadorErrores = document.getElementById("contador-errores");
    const palabraActualTxt = document.getElementById("palabra-actual");
    const esferasProgreso = document.querySelectorAll(".progreso-esferas .esfera");
    const etiquetaNivel = document.querySelector(".etiqueta-nivel");

    // === ESTADO DEL JUEGO ===
    let urlDestino = "NivelFacil.html"; // Por defecto
    let aciertos = 7;
    let errores = 3;
    let indicePalabra = 3; // Empezamos en la palabra 3 como la imagen de muestra
    const totalPalabras = 10;

    // Base de datos de palabras de ejemplo por nivel [Palabra incorrecta, Palabra corregida]
    const bancoPalabras = {
        "FÁCIL": [
            ["havion", "avion"], ["baca", "vaca"], ["ueso", "hueso"], 
            ["çapato", "zapato"], ["gato", "gato"], ["perro", "perro"],
            ["casa", "casa"], ["sol", "sol"], ["luna", "luna"], ["agua", "agua"]
        ],
        "MEDIO": [
            ["jirafa", "jirafa"], ["examen", "examen"], ["biyete", "billete"],
            ["acción", "acción"], ["objeto", "objeto"], ["burbuja", "burbuja"]
        ],
        "DIFÍCIL": [
            ["idiosincrasia", "idiosincrasia"], ["otorrinolaringologo", "otorrinolaringólogo"],
            ["escepticismo", "escepticismo"], ["vicisitud", "vicisitud"]
        ]
    };

    let dificultadActual = "FÁCIL";

    // === 1. SELECCIÓN DE DIFICULTAD ===
    botonesDificultad.forEach(boton => {
        boton.addEventListener("click", () => {
            // Remover estado activo de los demás botones
            botonesDificultad.forEach(b => b.classList.remove("activo"));
            
            // Activar el botón presionado
            boton.classList.add("activo");
            
            // Actualizar URL de redirección
            urlDestino = boton.getAttribute("data-url");

            // Actualizar dinámicamente el texto de la interfaz central
            if (boton.classList.contains("facil")) dificultadActual = "FÁCIL";
            if (boton.classList.contains("medio")) dificultadActual = "MEDIO";
            if (boton.classList.contains("dificil")) dificultadActual = "DIFÍCIL";

            etiquetaNivel.textContent = `⭐ NIVEL: ${dificultadActual}`;
            
            // Reiniciar simulador al cambiar nivel
            reiniciarSimulador();
        });
    });

    // === 2. BOTÓN INICIAR (Redirección HTML) ===
    btnIniciar.addEventListener("click", () => {
        alert(`¡Cargando pantalla de juego: ${dificultadActual}!`);
        window.location.href = urlDestino;
    });

    // === 3. BOTÓN COMPROBAR (Lógica de validación) ===
    btnComprobar.addEventListener("click", validarPalabra);

    // Permitir comprobar también presionando la tecla "Enter" en el input
    palabraUsuario.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            validarPalabra();
        }
    });

    function validarPalabra() {
        const intento = palabraUsuario.value.trim().toLowerCase();
        const palabraCorrecta = bancoPalabras[dificultadActual][indicePalabra - 1][1];

        if (intento === "") {
            alert("Por favor, escribe una palabra antes de comprobar.");
            return;
        }

        if (intento === palabraCorrecta) {
            aciertos++;
            contadorAciertos.textContent = aciertos;
            marcarEsfera(indicePalabra, "completada");
            alert("¡Excelente! ¡Palabra correcta! 🎉");
        } else {
            errores++;
            contadorErrores.textContent = errores;
            alert(`¡Ups! Inténtalo de nuevo. La respuesta correcta era: ${palabraCorrecta} 💡`);
        }

        // Avanzar a la siguiente palabra
        if (indicePalabra < totalPalabras) {
            indicePalabra++;
            actualizarInterfazProgreso();
        } else {
            alert("¡Has terminado este nivel! Haz clic en Iniciar para cargar el siguiente.");
            reiniciarSimulador();
        }
    }

    // === 4. FUNCIONES AUXILIARES DE INTERFAZ ===
    function actualizarInterfazProgreso() {
        palabraActualTxt.textContent = indicePalabra;
        
        // Actualizar la palabra en el recuadro central azul
        const nuevaPalabra = bancoPalabras[dificultadActual][indicePalabra - 1][0];
        palabraPantalla.textContent = nuevaPalabra;

        // Actualizar estados visuales de las esferas inferiores
        esferasProgreso.forEach((esfera, idx) => {
            const numeroEsfera = idx + 1;
            esfera.classList.remove("activa");
            
            if (numeroEsfera === indicePalabra) {
                esfera.classList.add("activa");
            }
        });

        // Limpiar el cuadro de texto del usuario
        palabraUsuario.value = "";
        palabraUsuario.focus();
    }

    function marcarEsfera(numero, clase) {
        if (esferasProgreso[numero - 1]) {
            esferasProgreso[numero - 1].classList.add(clase);
        }
    }

    function reiniciarSimulador() {
        aciertos = 0;
        errores = 0;
        indicePalabra = 1;
        contadorAciertos.textContent = aciertos;
        contadorErrores.textContent = errores;
        
        // Limpiar estilos de esferas
        esferasProgreso.forEach(esfera => {
            esfera.classList.remove("completada", "activa");
        });

        actualizarInterfazProgreso();
    }
});

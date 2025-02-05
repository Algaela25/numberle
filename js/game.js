"use strict";

//Constantes del juego
const SIZE = 5;
const candidatos = [1,2,3,4,5,6,7,8,9,0];
const TRY = 6;

//Variables del juego
let estadoJuego = false;
let intento = 0;
let secuencia = [];
let respuesta = [];

const initGame = () => {
    //Genera la combinacion oculta
    
    let candidatosMezclados = [...candidatos].sort(() => Math.random() - 0.5);
    respuesta = candidatosMezclados.splice(0,SIZE);

    console.log({ respuesta });

    initObjects();
    // Mas logica del juego que te interesa saber cuando y donde se inicializa
    initEventListeners();
};

const find = (element, array) => {
    let encontrado = false;
    let j = 0;
    while(!encontrado && j < array.length){
        if(element == array[j]) 
        encontrado = true;
        j++;
    }
    return encontrado;
}

const submit = () => {
    intento++;

    //Secuencia
    const row = document.createElement("div");
    row.classList = `try${intento}`;
  
    //Comprovacion
    let num = null;
    let correctos = 0;
    for (let i = 0; i < secuencia.length; i++) {
        num = document.createElement("cuadrado");

        if (secuencia[i] == respuesta[i]){ //Esta en la posicion correcta
            num.classList = "correcto";
            document.getElementById(`${secuencia[i]}`).classList.add("correcto");
            correctos++;
        } 
        else if (find(secuencia[i], respuesta)){  //No esta en la posicion correcta
            num.classList = "aceptado";
            document.getElementById(`${secuencia[i]}`).classList.add("aceptado");
        } 
        else { //No existe en la respuesta
            num.classList = "denegado";
            document.getElementById(`${secuencia[i]}`).classList.add("denegado");
        }

        num.innerText = secuencia[i];
        row.appendChild(num);
    }

    document.getElementById("historial").appendChild(row);   //Guarda la secuencia
    secuencia = [];   //Reinicia la secuencia
  
    if(correctos >= SIZE) return winGame();  //Gana
    if(intento >= TRY) return gameOver();    //Pierde
};

const gameOver = () => {
    estadoJuego = true;
    console.log("GAME OVER");
};

const winGame = () => {
    estadoJuego = true;
    console.log("GANASTE");
};

const vibrate = (node) => {
    node.style.animation = "vibrate 0.1s linear 3";
    setTimeout(() => {
        node.style.animation = "none";
    }, 300);
}

const onDigit = (digit) => {
    if (estadoJuego) return;

    let row = document.getElementById("secuencia");
    
    if (secuencia.length < SIZE) {
        let num = document.createElement("cuadrado");
        num.innerText = digit;
        row.appendChild(num);
        secuencia.push(digit);
    } else {
        vibrate(row);
    }
}

//Input de las teclas en rango [0-9], Enter o Backspace
const onKeyDown = (e) => {
    if (estadoJuego) return;

    let row = document.getElementById("secuencia");

    if (e.key.length === 1 && find(e.key,candidatos)) {
        onDigit(e.key);
    } else if (e.key === "Backspace" && secuencia.length > 0) {
        row.removeChild(row.lastChild);
        secuencia.pop();
    } else if (e.key === "Enter" && secuencia.length === SIZE) {
        row.innerHTML = "";
        submit();
    } else {
        vibrate(row);
    }
};

const initObjects = () => {

    let teclado = document.getElementById("numeros");

    candidatos.forEach(cand => {
        let node = document.createElement("button");
        node.classList = "cuadrado";
        node.id = cand;
        node.innerHTML = cand;
        teclado.appendChild(node);
    });
}

const initEventListeners = () => {
    document.addEventListener("keydown", onKeyDown);

    // Los onclick de los cuadrados
    const cuadrados = document.querySelectorAll("#numeros .cuadrado");
    cuadrados.forEach((cuad) => {
        cuad.addEventListener("click", () => {
            const digit = cuad.id;
            onDigit(digit);
        });
    });

    document.getElementById("submit").addEventListener("click", () => {
        let row = document.getElementById("secuencia");
        if (secuencia.length === SIZE) {
            row.innerHTML = "";
            submit();
        } else {
            vibrate(row);
        }
    });  

};


// Ahora que hemos leido todo el codigo, podemos ejecutarlo sin problema.
initGame();

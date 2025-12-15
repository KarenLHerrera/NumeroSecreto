let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;

const inputNumero = document.getElementById("numeroInput");
const inputNombre = document.getElementById("nombreInput");
const mensaje = document.getElementById("mensaje");
const intentosElemento = document.getElementById("intentos");

// Cargar puntajes al iniciar
cargarPuntajes();

async function verificarNumero() {
  const numeroIngresado = parseInt(inputNumero.value);
  
  if (isNaN(numeroIngresado) || numeroIngresado < 1 || numeroIngresado > 100) {
    mensaje.innerText = "Por favor ingresa un número entre 1 y 100.";
    mensaje.style.color = "red";
  }else{
    intentos++;
    intentosElemento.innerText = intentos;

  if (numeroIngresado === numeroSecreto) {
    mensaje.innerText = `Felicidades! Has adivinado el número ${numeroSecreto} en ${intentos} intentos.`;
    mensaje.style.color = "green";
    document.getElementById("btnVerificar").disabled = true;
    document.getElementById("numeroInput").disabled = true;
    document.getElementById("nombreInput").disabled = true;
    
    // Guardar puntaje y luego limpiar el nombre
    await guardarPuntaje(inputNombre.value, intentos);
    inputNombre.value = "";
  } else if (numeroIngresado < numeroSecreto) {
    mensaje.innerText = "El número es mayor. Intenta de nuevo.";
    mensaje.style.color = "red";
  } else {
    mensaje.innerText = "El número es menor. Intenta de nuevo.";
    mensaje.style.color = "red";
  }
}
}

async function guardarPuntaje(nombre, intentos) {
  try {
    const response = await fetch('/api/puntajes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        nombre: nombre, 
        intentos: intentos 
      })
    });
    
    if (response.ok) {
      cargarPuntajes();
    }
  } catch (error) {
    console.error('Error al guardar puntaje:', error);
  }
}

async function cargarPuntajes() {
  try {
    const response = await fetch('/api/puntajes');
    const puntajes = await response.json();
    mostrarPuntajes(puntajes);
  } catch (error) {
    console.error('Error al cargar puntajes:', error);
  }
}

function mostrarPuntajes(puntajes) {
  const tbody = document.getElementById('puntajesBody');
  tbody.innerHTML = '';
  
  puntajes
    .sort((a, b) => a.intentos - b.intentos)
    .slice(0, 10)
    .forEach(puntaje => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${puntaje.nombre}</td>
        <td>${puntaje.intentos}</td>
        <td>${new Date(puntaje.fecha).toLocaleDateString()}</td>
      `;
      tbody.appendChild(tr);
    });
}

document
  .getElementById("formJuego")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    verificarNumero();
  });
document.getElementById("nombreInput").focus();

// reinicio mi juego
document.getElementById("btnReiniciar").addEventListener("click", function () {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  document.getElementById("intentos").innerText = intentos;
  document.getElementById("mensaje").innerText = "";
  document.getElementById("btnVerificar").disabled = false;
  document.getElementById("numeroInput").disabled = false;
  document.getElementById("nombreInput").disabled = false;
  document.getElementById("numeroInput").value = "";
  document.getElementById("nombreInput").value = "";
  document.getElementById("nombreInput").focus();
});

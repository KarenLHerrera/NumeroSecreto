let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;

function verificarNumero() {
  const inputNumero = document.getElementById("numeroInput");
  const mensaje = document.getElementById("mensaje");
  const numeroIngresado = parseInt(inputNumero.value);
  const intentosElemento = document.getElementById("intentos");
  intentos++;
  intentosElemento.innerText = intentos;
  if (numeroIngresado === numeroSecreto) {
    mensaje.innerText = `¡Felicidades! Has adivinado el número ${numeroSecreto} en ${intentos} intentos.`;
    mensaje.style.color = "green";
    document.getElementById("btnVerificar").disabled = true;
    document.getElementById("numeroInput").disabled = true;
  } else if (numeroIngresado < numeroSecreto) {
    mensaje.innerText = "El número es mayor. Intenta de nuevo.";
    mensaje.style.color = "red";
  } else {
    mensaje.innerText = "El número es menor. Intenta de nuevo.";
    mensaje.style.color = "red";
  }
}
document
  .getElementById("formJuego")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    verificarNumero();
  });
document.getElementById("numeroInput").focus();


// reinicio mi juego
document.getElementById("btnReiniciar").addEventListener("click", function () {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  document.getElementById("intentos").innerText = intentos;
  document.getElementById("mensaje").innerText = "";
  document.getElementById("btnVerificar").disabled = false;
  document.getElementById("numeroInput").disabled = false;
  document.getElementById("numeroInput").value = "";
  document.getElementById("numeroInput").focus();
});
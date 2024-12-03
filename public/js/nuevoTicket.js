const usuario = JSON.parse(sessionStorage.getItem('usuario'));
const nombreUsuario = usuario.nombre;
const elementoUsuario = document.getElementById('nombre-usuario');

elementoUsuario.textContent = nombreUsuario;

// Obtiene todos los elementos con la clase "cerrar-sesion" y agrega un evento de clic a cada uno
const cerrarSesionButtons = document.querySelectorAll('.cerrar-sesion');
for (let button of cerrarSesionButtons) {
    button.addEventListener('click', function() {
        // Elimina la sesión storage
        sessionStorage.removeItem('usuario');
        // Redirige al usuario a la vista de iniciar sesión
        window.location.href = '/signin';
    });
}

let tableros; // Declarar tableros en un ámbito más amplio

const tablerosDiv = document.getElementById('tableros');

function volver() {
  fetch('http://localhost:3000/home')
    .then((response) => {
      if (response.ok) {
        window.location.href = '/home';
      } else {
        console.error('Error al llegar al endpoint');
      }
    })
    .catch((error) => {
      console.error('Error al hacer el fetch:', error);
    });
}

function obtenerTableroId() {
    console.log('Se está ejecutando la función obtenerTableroId');
    const tableroId = localStorage.getItem('tableroId');
    console.log(tableroId); // debería mostrar el ID del tablero
}

window.addEventListener('load', obtenerTableroId);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = document.querySelector('#titulo').value;
  const descripcion = document.querySelector('#descripcion').value;
  const usuario_id = JSON.parse(sessionStorage.getItem('usuario')).id;
  const tablero_id = localStorage.getItem('tableroId');
  
  // Enviar solicitud POST al endpoint /crearTicket
  fetch('/crearTicket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo,
      descripcion,
      usuario_id,
      tablero_id
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Ticket creado correctamente') {
      alert('Ticket creado correctamente!');
      // Limpiar los inputs
      setTimeout(() => {
        const tituloInput = document.querySelector('#titulo');
        tituloInput.value = '';
      }, 100);
      const descripcionInput = document.querySelector('#descripcion');
      descripcionInput.value = '';
    } else {
      alert('Error al crear el ticket');
    }
  })
  .catch(error => console.error(error));
});
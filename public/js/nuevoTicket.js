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
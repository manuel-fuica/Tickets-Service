
// Evento submit del formulario de registro, para crear un nuevo usuario
document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtiene los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    // Enviar solicitud POST al endpoint /signup
    const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
    });

    // Maneja la respuesta del servidor
    const data = await response.json();

    if (response.ok) {
        alert(data.message);
        window.location.href = '/';
    } else {
        alert(data.error);
    }

});
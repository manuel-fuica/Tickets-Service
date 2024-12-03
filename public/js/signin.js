document.getElementById('signinForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        const nombreUsuario = data.nombreUsuario; // Obtén el nombre del usuario desde la respuesta
        const idUsuario = data.idUsuario;
        const usuario = { nombre: nombreUsuario, id: idUsuario };
        sessionStorage.setItem('usuario', JSON.stringify(usuario)); // Almacena el nombre del usuario en la variable de sesión
        alert(data.message);
        window.location.href = './home';
    } else {
        alert(data.error);
    }

});
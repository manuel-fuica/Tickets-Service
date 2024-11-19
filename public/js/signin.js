

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
        alert(data.message);
        window.location.href = './home';
    } else {
        alert(data.error);
    }

});
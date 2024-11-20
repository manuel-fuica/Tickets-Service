// home.js
const tablerosDiv = document.getElementById('tableros');

// home.js
fetch('/tableros')
    .then(response => response.json())
    .then(tableros => {
        const tablerosDiv = document.getElementById('tableros');
        tablerosDiv.innerHTML = '';

        tableros.forEach(tablero => {
            const tableroHTML = `
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${tablero.nombre}</h5>
              <p class="card-text">${tablero.descripcion}</p>
              <button class="btn btn-primary">Ver tickets</button>
            </div>
          </div>
        </div>
      `;
            tablerosDiv.innerHTML += tableroHTML;
        });
    })
    .catch(error => console.error(error));
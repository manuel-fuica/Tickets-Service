// home.js
const tablerosDiv = document.getElementById('tableros');

// home.js
fetch('/tableros')
  .then(response => response.json())
  .then(tableros => {
    console.log('Tableros obtenidos:', tableros);

    const tablerosDiv = document.getElementById('tableros');
    tablerosDiv.innerHTML = '';

    tableros.forEach(tablero => {
      console.log('Tablero:', tablero);

      const tableroHTML = `
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${tablero.nombre}</h5>
              <p class="card-text">${tablero.descripcion}</p>
              <button class="btn btn-primary" id="ver-tickets-${tablero.id}" onclick="verTickets(${tablero.id})">Ver tickets</button>
            </div>
          </div>
        </div>
      `;
      tablerosDiv.innerHTML += tableroHTML;
    });
  })
  .catch(error => console.error('Error:', error));

function verTickets(id) {
  console.log('Se hizo clic en el botón Ver Tickets');

  document.querySelector('.img-principal').style.display = 'none';

  const ticketsContainer = document.getElementById("tickets-container");
  ticketsContainer.innerHTML = ''; // limpia el contenedor

  const respuesta = fetch(`/tablero/${id}`);
  respuesta.then(response => {
    console.log('Respuesta:', response);
    if (response.ok) {
      response.text().then(text => {
        if (text.trim() === '') {
          const mensaje = `
            <h2>No hay tickets para ver</h2>
            <p>No hay tickets registrados para este tablero.</p>
          `;
          ticketsContainer.innerHTML = mensaje;
        } else {
          try {
            const tickets = JSON.parse(text);
            console.log('Tickets:', tickets);

            if (tickets.length > 0) {
              const htmlTickets = `
                <h2>Tickets del tablero ${id}</h2>
                <div class="w-100">
                  <ul class="list-group">
                    ${tickets.map(ticket => `
                      <li class="list-group-item">
                        <div class="row">
                          <div class="col-6">
                            <h5>${ticket.titulo}</h5>
                          </div>
                          <div class="col-4 text-end">
                            <span>Estado: </span>
                            <select class="form-control text-end">
                              <option value="abierto" ${ticket.estado === 'abierto' ? 'selected' : ''}>Abierto</option>
                              <option value="cerrado" ${ticket.estado === 'cerrado' ? 'selected' : ''}>Cerrado</option>
                              <option value="pendiente" ${ticket.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            </select>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12 text-nowrap overflow-hidden">
                            <p>${ticket.descripcion}</p>
                          </div>
                        </div>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `;
              ticketsContainer.innerHTML = htmlTickets;
            } else {
              // No hay tickets, no mostramos nada
            }
          } catch (error) {
            console.error('Error:', error);
            const mensaje = `
              <h2>Error al cargar tickets</h2>
              <p>Ocurrió un error al cargar los tickets. Por favor, inténtelo de nuevo.</p>
            `;
            ticketsContainer.innerHTML = mensaje;
          }
        }
      });
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  })
  .catch(error => console.error('Error:', error));
}
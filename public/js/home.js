let tableros; // Declarar tableros en un ámbito más amplio

const tablerosDiv = document.getElementById('tableros');

fetch('/tableros')
    .then(response => response.json())
    .then(data => {
        tableros = data; // Asignar el valor de la respuesta a la variable tableros

        tablerosDiv.innerHTML = '';

        tableros.forEach(tablero => {

            const tableroHTML = `
        <div class="col-12 mb-2">
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
            <p>No hay tickets registrados para el tablero seleccionado.</p>
            `;
                    ticketsContainer.innerHTML = mensaje;
                } else {
                    try {
                        const tickets = JSON.parse(text);
                        console.log('Tickets:', tickets);

                        if (tickets.length > 0) {
                            const tableroNombre = tableros.find(tablero => tablero.id === id).nombre;
                            const htmlTickets = `
                <h2>Tickets tablero: ${tableroNombre}</h2>
                <div class="w-100">
                    <div class="list-group">
                        ${tickets.map(ticket => `
                            <div class="card mb-3 p-2">
                                <h6>Fecha de creación: ${new Date(ticket.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h6>
                                <span>Estado: ${ticket.estado.toUpperCase()}</span>
                                <h5>Asunto: ${ticket.titulo}</h5>
                                <span>Descripcion: </span>
                                <p>${ticket.descripcion}</p>
                                    <div class="row">
                                        <div class="input-group">
                                          <select class="form-select" id="estado">
                                            <option selected>Seleccionar</option>
                                            <option value="abierto">Abierto</option>
                                            <option value="cerrado">Cerrado</option>
                                            <option value="pendiente">Pendiente</option>
                                          </select>
                                          <button class="btn btn-primary" type="button">Cambiar estado</button>
                                        </div>
                                    </div>
                                    
                            </div>
                    `).join('')}
                    </d>
                </div>
                `;
                            ticketsContainer.innerHTML = htmlTickets;
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


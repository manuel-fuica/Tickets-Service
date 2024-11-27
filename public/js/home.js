let tableros; // Declarar tableros en un ámbito más amplio

const tablerosDiv = document.getElementById('tableros');

// Obtener los tableros
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

// Función para ver los tickets de un tablero
function verTickets(id) {
    console.log('Se hizo clic en el botón Ver Tickets');
    document.querySelector('.img-principal').style.display = 'none';

    const ticketsContainer = document.getElementById("tickets-container");
    ticketsContainer.innerHTML = ''; // limpia el contenedor

    // Obtener tickets del tablero
    fetch(`/tablero/${id}`)
        .then(response => response.json())
        .then(tickets => {
            if (tickets.length === 0) {
                ticketsContainer.innerHTML = `<h2>No hay tickets para ver</h2><p>No hay tickets registrados para el tablero seleccionado.</p>`;
            } else {
                const tableroNombre = tableros.find(tablero => tablero.id === id).nombre;
                const htmlTickets = `
                    <h2>Tickets tablero: ${tableroNombre}</h2>
                    <div class="w-100">
                      <div class="list-group">
                        ${tickets.map(ticket => `
                          <div class="card mb-3 p-2" data-ticket-id="${ticket.id}">
                            <h6>Fecha de creación: ${new Date(ticket.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h6>
                            ${ticket.fecha_cierre ? `<h6 id="fecha-cierre-${ticket.id}">Fecha de cierre: ${new Date(ticket.fecha_cierre).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h6>` : ''}
                            <span>Estado: ${ticket.estado.toUpperCase()}</span>
                            <h5>Asunto: ${ticket.titulo}</h5>
                            <span>Descripcion: </span>
                            <p>${ticket.descripcion}</p>
                            <div class="row">
                              <div class="input-group">
                                <select class="form-select" id="estado-${ticket.id}">
                                  <option value="abierto" ${ticket.estado === 'abierto' ? 'selected' : ''}>Abierto</option>
                                  <option value="cerrado" ${ticket.estado === 'cerrado' ? 'selected' : ''}>Cerrado</option>
                                  <option value="pendiente" ${ticket.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                </select>
                                <button class="btn btn-primary" type="button" onclick="cambiarEstado(${ticket.id}, '${ticket.estado}')">Cambiar estado</button>
                              </div>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                ticketsContainer.innerHTML = htmlTickets;
                verificarSiHayTickets();
            }
        })
        .catch(error => console.error('Error al cargar los tickets:', error));
}

// Función para cambiar el estado de un ticket
function cambiarEstado(id, estadoActual) {
    const select = document.querySelector(`#estado-${id}`);
    const nuevoEstado = select.value;

    // Validación: si el estado no se ha seleccionado
    if (!nuevoEstado) {
        console.error("No se puede seleccionar 'Seleccionar' como estado");
        return;
    }

    // Validación para evitar cambiar a "cerrado" si ya está cerrado
    if (estadoActual === 'cerrado' && nuevoEstado === 'cerrado') {
        alert("El ticket ya está cerrado. No se puede volver a cerrar.");
        return;
    }

    let fechaCierre = null;
    if (nuevoEstado === 'cerrado') {
        fechaCierre = new Date().toISOString();
    }

    // Enviar la solicitud para actualizar el estado
    fetch(`/ticket/${id}/estado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estado: nuevoEstado,
            fechaCierre: fechaCierre
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Estado del ticket actualizado correctamente');

            // Obtener el ticket en el DOM
            const ticketDiv = document.querySelector(`.card.mb-3.p-2[data-ticket-id="${id}"]`);
            if (!ticketDiv) {
                console.error('Ticket no encontrado');
                return;
            }

            // Actualizar el estado del ticket en el DOM
            let estadoSpan = ticketDiv.querySelector('span');
            estadoSpan.innerHTML = `Estado: ${nuevoEstado.toUpperCase()}`;

            // Si el estado es cerrado, agregar la fecha de cierre
            let fechaCierreSpanExistente = ticketDiv.querySelector(`#fecha-cierre-${id}`);
            if (nuevoEstado === 'cerrado' && !fechaCierreSpanExistente) {
                const nuevoFechaCierreSpan = document.createElement('h6');
                nuevoFechaCierreSpan.id = `fecha-cierre-${id}`;
                nuevoFechaCierreSpan.innerHTML = `Fecha de cierre: ${new Date(fechaCierre).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
                ticketDiv.appendChild(nuevoFechaCierreSpan);
            } else if ((nuevoEstado === 'abierto' || nuevoEstado === 'pendiente') && fechaCierreSpanExistente) {
                // Eliminar la fecha de cierre si el estado es abierto o pendiente
                fechaCierreSpanExistente.remove();
            }
        } else {
            console.error('Error al actualizar el estado del ticket');
        }
    })
    .catch(error => console.error('Error al cambiar el estado del ticket:', error));
}

// Función para mostrar mensaje de no hay tickets
function mostrarMensajeNoHayTickets() {
    const tablero = document.querySelector('.tablero');
    const mensaje = document.createElement('div');
    mensaje.innerHTML = 'No hay tickets en el tablero seleccionado';
    mensaje.className = 'mensaje-no-hay-tickets';
    tablero.appendChild(mensaje);
}

// Función para ocultar mensaje de no hay tickets
function ocultarMensajeNoHayTickets() {
    const mensaje = document.querySelector('.mensaje-no-hay-tickets');
    if (mensaje) {
        mensaje.remove();
    }
}

// Función para verificar si hay tickets
function verificarSiHayTickets() {
    const ticketDivs = document.querySelectorAll('.card.mb-3.p-2');
    if (ticketDivs.length === 0) {
        mostrarMensajeNoHayTickets();
    } else {
        ocultarMensajeNoHayTickets();
    }
}

// Llamar a la función para verificar si hay tickets
verificarSiHayTickets();

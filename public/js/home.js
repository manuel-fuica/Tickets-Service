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
                  <h5 class="card-title">Tablero: ${tablero.nombre}</h5>
                  <p class="card-text">${tablero.descripcion}</p>
                  <button class="btn btn-primary" id="ver-tickets-${tablero.id}" onclick="verTickets(${tablero.id})">Ver tickets</button>
                  <button class="btn btn-success nuevo-ticket" id="nuevo-ticket-${tablero.id}" title="Nuevo Ticket" data-tablero-id="${tablero.id}" onclick="rutaNuevoTicket(event)">Nuevo Ticket</button>
                </div>
              </div>
            </div>
          `;
            tablerosDiv.innerHTML += tableroHTML;
        });
    })
    .catch(error => console.error('Error:', error));

function rutaNuevoTicket(event) {
  const tableroId = event.target.getAttribute('data-tablero-id');
  console.log('ID del tablero:', tableroId);
  localStorage.setItem('tableroId', tableroId);
  fetch('http://localhost:3000/nuevoticket')
    .then((response) => {
      if (response.ok) {
        window.location.href = '/nuevoticket';
      } else {
        console.error('Error al llegar al endpoint');
      }
    })
    .catch((error) => {
      console.error('Error al hacer el fetch:', error);
    });
}



// Función para ver los tickets de un tablero
function verTickets(id) {
    console.log('Se hizo clic en el botón Ver Tickets');
    document.querySelector('.img-principal').style.display = 'none';

    const ticketsContainer = document.getElementById("tickets-container");
    ticketsContainer.innerHTML = ''; // Limpia el contenedor

    // Obtener tickets del tablero
    fetch(`/tablero/${id}`)
        .then(response => response.json())
        .then(tickets => {
            if (tickets.length === 0) {
                ticketsContainer.innerHTML = `
                    <h2>No hay tickets para ver</h2>
                    <p>No hay tickets registrados para el tablero seleccionado.</p>`;
                verificarSiHayTickets();  // Solo se llama aquí
            } else {
                const tableroNombre = tableros.find(tablero => tablero.id === id).nombre;
                const htmlTickets = `
                    <h2>Tickets tablero: ${tableroNombre}</h2>
                    <div class="w-100">
                      <div class="list-group">
                        ${tickets.map(ticket => `
                          <div class="card mb-3 p-2 ${ticket.estado}" data-ticket-id="${ticket.id}">
                            <h6>Fecha de creación: ${new Date(ticket.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h6>
                            ${ticket.fecha_cierre ? `<h6 id="fecha-cierre-${ticket.id}">Fecha de cierre: ${new Date(ticket.fecha_cierre).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h6>` : ''}
                            <span>Estado: ${ticket.estado.toUpperCase()}</span>
                            <h5>Asunto: ${ticket.titulo}</h5>
                            <span>Descripción:</span>
                            <p>${ticket.descripcion}</p>
                            <div class="row">
                              <div class="input-group">
                                <select class="form-select" id="estado-${ticket.id}">
                                  <option value="abierto" ${ticket.estado === 'abierto' ? 'selected' : ''}>Abierto</option>
                                  <option value="cerrado" ${ticket.estado === 'cerrado' ? 'selected' : ''}>Cerrado</option>
                                  <option value="pendiente" ${ticket.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                </select>
                                <button class="btn btn-primary" type="button" onclick="cambiarEstado(${ticket.id})">Cambiar estado</button>
                              </div>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                ticketsContainer.innerHTML = htmlTickets;
                verificarSiHayTickets();  // Aquí también
            }
        })
        .catch(error => console.error('Error al cargar los tickets:', error));
}

// Función para cambiar el estado de un ticket
function cambiarEstado(id) {
    const select = document.querySelector(`#estado-${id}`);
    const nuevoEstado = select.value;

    // Obtener el estado actual desde el DOM
    const ticketDiv = document.querySelector(`.card[data-ticket-id="${id}"]`);
    const estadoSpan = ticketDiv.querySelector('span');
    const estadoActual = estadoSpan.textContent.split(':')[1].trim().toLowerCase();

    // Validación: evitar cerrar un ticket ya cerrado
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
                actualizarDOMEstado(id, nuevoEstado, fechaCierre);
            } else {
                console.error('Error al actualizar el estado del ticket');
            }
        })
        .catch(error => console.error('Error al cambiar el estado del ticket:', error));
}

// Función para actualizar el DOM después de cambiar el estado
function actualizarDOMEstado(id, nuevoEstado, fechaCierre) {
    const ticketDiv = document.querySelector(`.card[data-ticket-id="${id}"]`);
    const estadoSpan = ticketDiv.querySelector('span');
    estadoSpan.innerHTML = `Estado: ${nuevoEstado.toUpperCase()}`;

    let fechaCierreSpan = ticketDiv.querySelector(`#fecha-cierre-${id}`);
    if (nuevoEstado === 'cerrado') {
        if (!fechaCierreSpan) {
            const nuevoFechaCierreSpan = document.createElement('h6');
            nuevoFechaCierreSpan.id = `fecha-cierre-${id}`;
            nuevoFechaCierreSpan.innerHTML = `Fecha de cierre: ${new Date(fechaCierre).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            const fechaCreacionSpan = ticketDiv.querySelector('h6');
            fechaCreacionSpan.insertAdjacentElement('afterend', nuevoFechaCierreSpan);
        }
    } else if (fechaCierreSpan) {
        // Eliminar la fecha de cierre si no está cerrado
        fechaCierreSpan.remove();
    }

    // Cambiar la clase según el estado
    ticketDiv.className = `card mb-3 p-2 ${nuevoEstado}`;
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

function verificarSiHayTickets() {
    const ticketsContainer = document.getElementById("tickets-container");
    if (!ticketsContainer.innerHTML.trim()) {
        ticketsContainer.innerHTML = `
            <h2>No hay tickets para ver</h2>
            <p>No hay tickets registrados para el tablero seleccionado.</p>`;
    }
}

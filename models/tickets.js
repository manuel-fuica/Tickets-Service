const pool = require('../config/config');
const { crearTicket } = require('../config/config');

// Funciones para crear los registros (tickets)
class Tickets {
    async create(titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id) {
        await crearTicket(titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id);
    }
}

// Exportamos la clase
module.exports = Tickets;
const tickets = require('../models/tickets');


// Controlador para crear un nuevo ticket
exports.createTicket = async (req, res) => {
    try {
        const { titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id } = req.body; 

        const nuevoTicket = await tickets.create(titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id);
        res.status(201).json({ message: 'Ticket creado correctamente', nuevoTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el ticket' });
    }
};
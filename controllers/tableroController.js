const tablero = require('../models/tablero');

// Controlador para crear un nuevo tablero
exports.createTablero = async (req, res) => {
    try {
        const { nombre, descripcion, usuario_id } = req.body;
        
        const nuevoTablero = await tablero.create(nombre, descripcion, usuario_id);
        res.status(201).json({ message: 'Tablero creado correctamente', nuevoTablero }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el tablero' }); 
    }
};
const Usuario = require('../models/user');

// Controlador para crear un nuevo usuario
exports.signup = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const nuevoUsuario = await Usuario.create(nombre, email, password);
        res.status(201).json({ message: 'Usuario creado correctamente', nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};



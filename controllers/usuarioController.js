const Usuario = require('../models/user');

// Controlador para iniciar sesión
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = new Usuario();
        const user = await usuario.findOne(email, password);
        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
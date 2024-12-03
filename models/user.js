const { pool } = require('../config/config');
const { crearUsuario } = require('../config/config');


// Funciones para crear los registros (usuarios)
class Usuario {
    async create(nombre, email, password) {
        await crearUsuario(nombre, email, password);
    }

    async findOne(email, password) {
        const query = `SELECT * FROM usuario WHERE email = $1 AND password = $2`;
        const result = await pool.query(query, [email, password]);
        return result.rows[0];
    }
}
// exportamos la clase
module.exports =  Usuario;
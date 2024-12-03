const pool = require('../config/config');
const { crearTablero } = require('../config/config');


//creamos tres clases para las tablas de la base de datos, estas se usaran para ejecutar las funciones definidas en el config
class Tablero {

    async create(nombre, descripcion, usuario_id) {
        await crearTablero(nombre, descripcion, usuario_id);
    }
}

module.exports = Tablero;
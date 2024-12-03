const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Tickets-Service',
    password: '1234',
    port: 5432,
});

// Función para crear las tablas y sus relaciones
async function crearTablas() {
    try {
        await crearTablaUsuario();
        await crearTablaTablero();
        await crearTablaTicket();
    } catch (error) {
        console.error(error);
    }
}

async function crearTablaUsuario() {
    try {
        const query = `CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );`;
        await pool.query(query);
        console.log('Tabla usuario creada');
    } catch (error) {
        console.error(error);
    }
}

async function crearTablaTablero() {
    try {
        const query = `CREATE TABLE IF NOT EXISTS tablero (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        usuario_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );`;
        await pool.query(query);
        console.log('Tabla tablero creada');
    } catch (error) {
        console.error(error);
    }
}

async function crearTablaTicket() {
    try {
        const query = `CREATE TABLE IF NOT EXISTS ticket (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        estado VARCHAR(255) NOT NULL,
        fecha_creacion DATE NOT NULL,
        fecha_cierre DATE,
        tablero_id INT NOT NULL,
        usuario_id INT NOT NULL,
        FOREIGN KEY (tablero_id) REFERENCES tablero(id),
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );`;
        await pool.query(query);
        console.log('Tabla ticket creada');
    } catch (error) {
        console.error(error);
    }
}


//crear usuario
const crearUsuario = async (nombre, email, password) => {
    if (!nombre) {
        throw new Error('Nombre es requerido');
    }
    try {
        
        const query = `INSERT INTO usuario (nombre, email, password) VALUES ($1, $2, $3)`;
        await pool.query(query, [nombre, email, password]);
        console.log('Usuario creado');
    } catch (error) {
        console.error(error);
    }
};


const crearTablero = async (nombre, descripcion, usuario_id) => {
    try {
        const query = `INSERT INTO tablero (nombre, descripcion, usuario_id) VALUES ($1, $2, $3)`;
        await pool.query(query, [nombre, descripcion, usuario_id]);
        console.log('Tablero creado');
    } catch (error) {
        console.error(error);
    }
};

const crearTicket = async (titulo, descripcion, tablero_id, usuario_id) => {
    try {
        const fecha_creacion = new Date().toISOString();
        const estado = 'abierto';
        const fecha_cierre = null;
        const query = `INSERT INTO ticket (titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        await pool.query(query, [titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id]);
        console.log('Ticket creado');
    } catch (error) {
        console.error(error);
    }
};


const getTableros = async () => {
    try {
        const query = `SELECT * FROM tablero`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error(error);
    }
};

const getTickets = async (id) => {
    try {
        const query = `SELECT id, titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id
        FROM ticket
        WHERE tablero_id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error(error);
    }
};

const updateEstadoTicket = async (idTicket, nuevoEstado, fechaCierre, fechaCreacion) => {
    try {
        let query = '';
        let result;
        if (nuevoEstado === 'pendiente') {
            query = `UPDATE ticket
        SET estado = $1
        WHERE id = $2;`;
            result = await pool.query(query, [nuevoEstado, idTicket]);
        } else if (nuevoEstado === 'cerrado') {
            query = `UPDATE ticket
        SET estado = $1, fecha_cierre = $2
        WHERE id = $3;`;
            result = await pool.query(query, [nuevoEstado, fechaCierre, idTicket]);
        } else if (nuevoEstado === 'abierto') {
            query = `UPDATE ticket
        SET estado = $1, fecha_creacion = $2, fecha_cierre = NULL
        WHERE id = $3;`;
            result = await pool.query(query, [nuevoEstado, fechaCreacion, idTicket]);
        }
        if (result.rowCount === 0) {
            throw new Error('No se pudo actualizar el estado del ticket');
        }
        return { message: 'Estado del ticket actualizado correctamente' };
    } catch (error) {
        console.error(error);
    }
};

const getUserName = async (req) => {
    try {
        const id = req.query.id; // obtener el ID del usuario de la query
        if (!id) {
            throw new Error('No se proporcionó un ID de usuario');
        }
        const query = `SELECT nombre FROM usuarios WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0].nombre;
    } catch (error) {
        console.error(error);
        throw error;
    }
};





//crearTablas();// Llamar a la función para crear las tablas

module.exports = { pool, crearUsuario, crearTablero, crearTicket, getTableros, getTickets, updateEstadoTicket, getUserName, crearTicket };
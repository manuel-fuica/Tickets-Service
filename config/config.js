const { Pool } = require('pg');

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

const crearTicket = async (titulo, descripcion, estado, fecha_creacion, fecha_cierre, tablero_id, usuario_id) => {
    try {
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

const getTableroId = async (id) => {
    try {
        const query = `SELECT id FROM tablero WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0].id;
    } catch (error) {
        console.error(error);
    }
};

const getTickets = async () => {
    try {
        const query = `SELECT * FROM ticket WHERE tablero_id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error(error);
    }
};



//crearTablas();// Llamar a la función para crear las tablas

module.exports = { pool, crearUsuario, crearTablero, crearTicket, getTableros, getTickets, getTableroId };
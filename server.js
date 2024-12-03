const express = require('express');
const path = require('path');
const Usuario = require('./models/user');
const Tickets = require('./models/tickets');
const { getTableros, getTickets, updateEstadoTicket, getUserName, crearTicket } = require('./config/config');


//middlewares
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.set("Content-Type", "application/javascript");
    }
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.send();
});




//carga inicial de datos
const cargaInicial = async () => {
    // try {
    //     // Crear usuarios
    //     const usuarios = [
    //         { nombre: 'Juan', email: 'juan@example.com', password: '1234' },
    //         { nombre: 'María', email: 'maria@example.com', password: '5678' },
    //         { nombre: 'Pedro', email: 'pedro@example.com', password: '9012' }
    //     ];
    //     await Promise.all(usuarios.map(usuario => new Usuario().create(usuario.nombre, usuario.email, usuario.password)));

    // } catch (error) {
    //     console.error(error);
    // }


    // try {
    //     // Crear tableros
    //     const tableros = [
    //         { nombre: 'Soporte Tecnico', descripcion: 'Gestion de tickets soporte tecnico', usuario_id: 1 },
    //         { nombre: 'Desarrollo Web', descripcion: 'Gestion de tickets de desarrollo web', usuario_id: 1 },
    //         { nombre: 'Analisis de Datos', descripcion: 'Gestion de tickets de analisis de datos', usuario_id: 2 },
    //         { nombre: 'Optimizacion SEO', descripcion: 'Gestion de tickets de optimizacion SEO', usuario_id: 3 }
    //     ];
    //     await Promise.all(tableros.map(tablero => new Tablero().create(tablero.nombre, tablero.descripcion, tablero.usuario_id)));
    // } catch (error) {
    //     console.error(error);
    // }

    try {
        // Crear tickets
        const tickets = [
            { titulo: 'Falla teclado', descripcion: 'No funciona el teclado', estado: 'abierto', fecha_creacion: new Date(), fecha_cierre: null, tablero_id: 1, usuario_id: 1 },
            { titulo: 'Hablitacion de pagina web', descripcion: 'No se puede acceder a la pagina', estado: 'abierto', fecha_creacion: new Date(), fecha_cierre: null, tablero_id: 1, usuario_id: 1 },
            { titulo: 'Presentar dashboard Power BI', descripcion: 'No se puede presentar el dashboard de Power BI', estado: 'abierto', fecha_creacion: new Date(), fecha_cierre: null, tablero_id: 2, usuario_id: 2 },
            { titulo: 'Error en la base de datos', descripcion: 'No se puede acceder a la base de datos, arroja error 500', estado: 'abierto', fecha_creacion: new Date(), fecha_cierre: null, tablero_id: 2, usuario_id: 2 },
            { titulo: 'Problema con el servidor', descripcion: 'El servidor no responde, arroja error 500', estado: 'abierto', fecha_creacion: new Date(), fecha_cierre: null, tablero_id: 3, usuario_id: 3 },
            { titulo: 'No carga la pagina', descripcion: 'La pagina esta con problemas, no esta cargando', estado: 'abierto', fecha_creacion: new Date(), fecha_cierre: null, tablero_id: 3, usuario_id: 3 }
        ];
        await Promise.all(tickets.map(ticket => new Tickets().create(ticket.titulo, ticket.descripcion, ticket.estado, ticket.fecha_creacion, ticket.fecha_cierre, ticket.tablero_id, ticket.usuario_id)));
    } catch (error) {
        console.error(error);
    }

}

//llamada a la funcion cargaInicial();


//Endpoints 

//ruta pra mostrar la vista
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'index.html'));
});

app.get('/', (req, res) => {
    res.redirect('/signin');
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'signup.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'home.html'));
});

app.get('/tableros', async (req, res) => {
    try {
        const tableros = await getTableros();
        res.json(tableros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los tableros' });
    }
});

app.get('/tablero/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ticketsTablero = await getTickets(id);
        res.json(ticketsTablero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los tickets del tablero' });
    }
})

//crear ticket

app.get('/nuevoTicket', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'nuevoTicket.html'));
});


app.post('/crearTicket', async (req, res) => {
    try {
        const { titulo, descripcion, usuario_id, tablero_id } = req.body;

        // Validación de datos de entrada
        if (!titulo || !descripcion || !usuario_id || !tablero_id) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const nuevoTicket = await crearTicket(titulo, descripcion, tablero_id, usuario_id);
        res.status(201).json({ message: 'Ticket creado correctamente', nuevoTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al crear el ticket: ${error.message}` });
    }
});


//ruta para crear un nuevo usuario
app.post('/signup', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const nuevoUsuario = await new Usuario().create(nombre, email, password);
        res.status(201).json({ message: 'Usuario creado correctamente', nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});


//ruta para iniciar sesion
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await new Usuario().findOne(email, password);
        if (!user) {
            throw new Error('Email o contraseña incorrectos');
        }
        res.json({
            message: 'Inicio de sesión exitoso',
            nombreUsuario: user.nombre,
            idUsuario: user.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
})

app.post('/ticket/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        let fechaCierre = null;
        let fechaCreacion = null;
        if (estado === 'cerrado') {
            fechaCierre = new Date().toISOString();
        } else if (estado === 'abierto') {
            fechaCreacion = new Date().toISOString();
        }
        const resultado = await updateEstadoTicket(id, estado, fechaCierre, fechaCreacion);
        res.status(200).json({ resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado del ticket' });
    }
});

app.get('/api/usuario/nombre', async (req, res) => {
    try {
        const nombre = await getUserName(req);
        res.json({ nombre });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al obtener el nombre del usuario' });
    }
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

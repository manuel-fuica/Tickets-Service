## Tickets Service

### Proyecto para practicar el desarrollo web fullstack

- El proyecto consiste en un sistema de tickets para soporte tecnico, esta realizado con node.js, node express y conectado a la base de datos PostgreSQL
- Se puede registrar si no tiene cuenta
- Iniciar sesion con su cuenta registrada
- Ver el home, el cual despliega los tableros activos, esto lo hace desde la base de datos PostgreSQL

## Estructura:

- En el archivo config esta la conexion a la base de datos y las funciones que realizan las consultas SQL
- Carpeta controller tiene los controladores, los cuales manejan el registro de usuario, inicio de sesion, creacion de tableros o tickets
- Carpeta models contiene los modelos de la base de datos
- Carpeta js contiene la estructura front del proyecto para manejar los eventos y solicitudes
- Carpeta vistas contiene las vistas html del navegador
- Archivo server contiene el servidor y los endpoint para las solicitudes 
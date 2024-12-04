## Tickets Service

### Proyecto para practicar el desarrollo web fullstack

- El proyecto consiste en un sistema de tickets para soporte tecnico, esta realizado con node.js, node express y conectado a la base de datos PostgreSQL
- Se puede registrar si no tiene cuenta
- Iniciar sesion con su cuenta registrada
- Muestra un icono con el nombre del usuario que inicio sesion y si le das click cierra la sesion
- Muestra el home, el cual despliega los tableros activos, esto lo hace desde la base de datos PostgreSQL
- Puede cambiar el estado de los ticket y si pasan a cerrado muestra la fecha de cierre, si pasan a abierto o pendiente elimina la fecha de cierre
- Puedes crear nuevos ticket, y dependiendo de donde crees el ticket toma el id del tablero, ademas usa el id del usuario que inicio sesion para guardar el ticket en la base de datos,puedes volver atras para ver el ticket y cambiar su estado

## Estructura:

- En el archivo config esta la conexion a la base de datos y las funciones que realizan las consultas SQL
- Carpeta controller tiene los controladores, los cuales manejan el registro de usuario, inicio de sesion, creacion de tableros o tickets
- Carpeta models contiene los modelos de la base de datos
- Carpeta js contiene la estructura front del proyecto para manejar los eventos y solicitudes
- Carpeta vistas contiene las vistas html del navegador
- Archivo server contiene el servidor y los endpoint para las solicitudes 

## Dejo un Gif con las funcionalidades de la APP
![Descripción del GIF](../Tickets-Service/public/img/Tickets-Service.gif)

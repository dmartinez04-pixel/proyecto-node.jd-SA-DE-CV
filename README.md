Sistema de Administración de Empleados — Recursos Humanos Taller de Node.js S.A

Aplicación web full-stack para la gestión de personal (CRUD) con autenticación mediante JSON Web Tokens (JWT). 
Permite a los administradores iniciar sesión y registrar, consultar, buscar, editar y eliminar empleados conectados a una base de 
datos MySQL.
Estructura del proyecto

```text
├── backend/                  # Servidor Node.js y Express
│   ├── config/               # Configuración de conexión a MySQL
│   ├── middleware/           # Verificación de JWT (auth) y manejo de CORS
│   ├── routes/               # Rutas de administradores (/admins) y empleados (/employees)
│   └── index.js              # Punto de entrada del servidor (puerto 3000)
│
└── interface/                # Interfaz de usuario (Frontend)
    ├── js/
    │   ├── empresa.js        # Lógica CRUD, peticiones Axios y validación de sesión
    │   └── login.js          # Autenticación de administradores y manejo de token
    ├── agregar.html          # Formulario de registro de empleados
    ├── consultar.html        # Tabla general y búsqueda por nombre
    ├── editar.html           # Búsqueda por ID y actualización de datos
    ├── eliminar.html         # Búsqueda por ID y confirmación de baja
    ├── estilos.css           # Estilos personalizados
    ├── index.html            # Menú principal
    └── login.html            # Pantalla de inicio de sesión
```

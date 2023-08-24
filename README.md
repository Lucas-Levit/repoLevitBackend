# repoLevitBackend

Este README proporciona una descripción general de la aplicación y sus funcionalidades, incluyendo una explicación de las diferentes rutas y endpoints utilizados en la aplicación.

Introducción
Esta aplicación es una plataforma basada en la web que permite crear usuarios, comprar y gestionar productos. Los usuarios pueden registrarse, iniciar sesión y acceder al carrito de compras. Los administradores tienen privilegios adicionales para gestionar productos y roles de usuario.

Cómo Ejecutar el Proyecto
Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

Clonar el Repositorio
Abre tu terminal y ejecuta el siguiente comando para clonar el repositorio:


git clone <https://github.com/Lucas-Levit/repoLevitBackend.git>
Instalar Dependencias
Navega a la carpeta del proyecto clonado:


cd repoLevitBackend
Instala las dependencias necesarias:


npm install
Configuración de Variables de Entorno
Crea un archivo .env en el directorio raíz del proyecto y agrega las variables de entorno necesarias. Aquí tienes un ejemplo de cómo podría ser:


URL_MONGODB_ATLAS=<mongodb+srv://lucassebas96:coletricolor@cluster0.h1ld86s.mongodb.net/?retryWrites=true&w=majority>


Ejecutar el Servidor
Inicia el servidor en modo de desarrollo con el siguiente comando:


npm run dev
El servidor estará escuchando en el puerto 4000 por defecto.

Acceder a la Aplicación
Abre tu navegador web y navega a http://localhost:4000 para acceder a la aplicación.

Funcionalidades
Autenticación de Usuario:
Registro y inicio de sesión de usuarios utilizando correo electrónico y contraseña.
Autenticación con GitHub para el registro de usuarios.
Gestión de Productos:
Explorar una lista de productos disponibles con detalles como título, descripción, precio, stock y estado.
Agregar productos al carrito de compras.
Carrito de Compras:
Los usuarios pueden ver su carrito de compras, modificar la cantidad de artículos y eliminar artículos.
Comprar productos del carrito, ajustando el stock de los productos en consecuencia.
Interfaz de Usuario:
La aplicación utiliza plantillas HTML para renderizar vistas utilizando Handlebars.
El estilo se logra utilizando CSS.

Rutas y Endpoints

Registro de Usuario:
GET /sessions/register: Renderiza el formulario de registro.
POST /sessions/register: Registra un nuevo usuario.

Inicio de Sesión de Usuario:
GET /sessions/login: Renderiza el formulario de inicio de sesión.
POST /sessions/login: Inicia sesión de un usuario.

Registro de GitHub :
GET /sessions/githubSignUp: Inicia el registro de GitHub.
GET /sessions/github: Callback de GitHub.

Cerrar Sesión de Usuario:
GET /sessions/logout: Cierra la sesión del usuario.

Página de Inicio:

GET /api/products: Renderiza la página de inicio con listados de productos.
Agregar Producto al Carrito:
POST /api/products/: Agrega un producto al carrito del usuario.

Carrito de Compras:
GET /api/cart/:cid: Recupera y muestra el carrito de compras del usuario.
PUT /api/cart/:cid: Actualiza el contenido del carrito de compras del usuario.
DELETE /api/cart/:cid: Elimina el carrito de compras del usuario.

Compra desde el Carrito:
POST /api/cart/:cid/purchase: Procesa la compra de productos en el carrito del usuario.

Uso
Registra un nuevo usuario utilizando el formulario de registro.
Inicia sesión usando tus credenciales registradas o GitHub.
Explora productos en la página de inicio y agrega artículos a tu carrito.
Accede a tu carrito de compras para ver, modificar o eliminar artículos.
Compra productos desde tu carrito.
Cierra sesión cuando hayas terminado.
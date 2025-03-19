Proyecto Node.js con MongoDB Atlas

Este es un proyecto de backend en Node.js que utiliza Express y MongoDB Atlas para gestionar productos y carritos de compras sobre una tienda de indumentaria de futbol.

- Requisitos previos

Asegúrate de tener instalado lo siguiente:

Node.js

MongoDB Atlas

Postman (opcional, para probar las API)

- Instalación y configuración

Clonar el repositorio:

git clone https://github.com/tu_usuario/proyecto-node.git
cd proyecto-node

Instalar dependencias:

npm install

Configurar las variables de entorno:

Crea un archivo .env en la raíz del proyecto y agrega:

MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/miBaseDeDatos
PORT=8080

Ejecutar el servidor:

npm start

El servidor estará corriendo en: http://localhost:8080

- Endpoints disponibles

Productos (/api/products)

GET /api/products → Obtiene todos los productos.

POST /api/products → Agrega un nuevo producto.

GET /api/products/:id → Obtiene un producto por ID.

PUT /api/products/:id → Actualiza un producto.

DELETE /api/products/:id → Elimina un producto.

Carritos (/api/carts)

GET /api/carts → Obtiene todos los carritos.

POST /api/carts → Crea un nuevo carrito.

GET /api/carts/:id → Obtiene un carrito por ID.

POST /api/carts/:id/product/:productId → Agrega un producto a un carrito.

DELETE /api/carts/:id/product/:productId → Elimina un producto del carrito.

- Poblar la base de datos

Para poblar la base de datos con datos iniciales, puedes usar un script en Node.js o importar un archivo JSON en MongoDB Atlas.

Ejemplo de carga de datos en products:

[
  { "title": "Producto 1", "price": 100, "stock": 50 },
  { "title": "Producto 2", "price": 200, "stock": 30 }
]

- Colección de Postman

Para probar los endpoints, importa el archivo postman_collection.json en Postman.

🛠 Tecnologías utilizadas

Node.js

Express.js

MongoDB Atlas

Mongoose

Autor: Tu Nombre | Año 2025


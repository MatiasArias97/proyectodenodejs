const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const productRouter = require('./routes/products.router');  // Ruta de productos
const viewsRouter = require('./routes/views.router');      // Ruta de vistas
const cartsRouter = require('./routes/carts.router');
require("dotenv").config(); // Cargar variables de entorno

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

module.exports.io = io;

const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();
const CartManager = require('./managers/CartManager');
const cartManager = new CartManager();

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conexión a MongoDB Atlas exitosa'))
  .catch(error => console.error('❌ Error al conectar a MongoDB:', error));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productRouter);  
app.use('/', viewsRouter);                
app.use('/api/carts', cartsRouter);

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

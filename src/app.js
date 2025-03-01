const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const productsRouter = require('./routes/products.router');
const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager'); // Importamos el CartManager
const mongoose = require('mongoose'); // Importamos mongoose

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productManager = new ProductManager('./data/products.json');
const cartManager = new CartManager('./data/carts.json'); // Inicializamos el CartManager

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(error => console.error('❌ Error al conectar a MongoDB:', error));

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);

// Página principal
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Lista de Productos', products });
});

// Página de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realtimeproducts', { title: 'Productos en Tiempo Real', products });
});

// WebSockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Actualización de productos en tiempo real
  socket.on('newProduct', async (product) => {
    await productManager.addProduct(product);
    io.emit('updateProducts', await productManager.getProducts());
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    io.emit('updateProducts', await productManager.getProducts());
  });

  // Nuevos eventos para la actualización en tiempo real del carrito

  // Agregar producto al carrito
  socket.on('addToCart', async ({ cartId, productId, quantity }) => {
    try {
      await cartManager.addProductToCart(cartId, productId, quantity);
      const updatedCart = await cartManager.getCartById(cartId);
      io.emit('updateCart', updatedCart); // Emitir la actualización del carrito a todos los clientes
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  });

  // Eliminar producto del carrito
  socket.on('removeFromCart', async ({ cartId, productId }) => {
    try {
      await cartManager.removeProductFromCart(cartId, productId);
      const updatedCart = await cartManager.getCartById(cartId);
      io.emit('updateCart', updatedCart);
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
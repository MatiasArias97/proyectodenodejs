  const express = require('express');
  const { engine } = require('express-handlebars');
  const path = require('path');
  const http = require('http');
  const socketIo = require('socket.io');
  const productsRouter = require('./routes/products.router');
  const ProductManager = require('./managers/ProductManager');

  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server);

  const productManager = new ProductManager('./data/products.json');

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

      socket.on('newProduct', async (product) => {
          await productManager.addProduct(product);
          io.emit('updateProducts', await productManager.getProducts());
      });

      socket.on('deleteProduct', async (id) => {
          await productManager.deleteProduct(id);
          io.emit('updateProducts', await productManager.getProducts());
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
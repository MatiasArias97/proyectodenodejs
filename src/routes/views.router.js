const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

// Página principal
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Lista de Productos', products });
});

// Página de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realtimeproducts', { title: 'Productos en Tiempo Real', products });
});

module.exports = router;

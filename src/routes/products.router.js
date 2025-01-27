const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./data/products.json');

// Ruta GET / - Listar productos
router.get('/', async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts(limit);
  res.json(products);
});

// Ruta GET /:pid - Producto por ID
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta POST / - Agregar producto
router.post('/', async (req, res) => {
  const product = req.body;
  const newProduct = await productManager.addProduct(product);
  res.status(201).json(newProduct);
});

// Ruta PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
  const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { title: 'Lista de Productos', products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

module.exports = router;
const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager('./data/carts.json');

// Ruta POST / - Crear carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({
      message: 'Carrito creado exitosamente',
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el carrito',
      details: error.message,
    });
  }
});

// Ruta GET /:cid - Listar productos de un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el carrito',
      details: error.message,
    });
  }
});

// Ruta POST /:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartManager.addProductToCart(cid, pid);
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al agregar producto al carrito',
      details: error.message,
    });
  }
});

// Ruta DELETE /:cid - Eliminar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const wasDeleted = await cartManager.deleteCart(cid);
    if (wasDeleted) {
      res.json({ message: `Carrito con ID ${cid} eliminado exitosamente` });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el carrito',
      details: error.message,
    });
  }
});

module.exports = router;
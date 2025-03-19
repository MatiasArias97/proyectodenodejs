const express = require('express');
const CartManager = require('../managers/CartManager');
const Cart = require('../models/cartModel');  // Usamos el modelo de carrito de MongoDB
const Product = require('../models/productModel');  // Usamos el modelo de productos
const { io } = require('../app'); // Traemos el objeto 'io' de socket.io para emitir eventos

const router = express.Router();

// Ruta POST / - Crear carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] }); // Crear carrito vacío
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
    const cart = await Cart.findById(req.params.cid).populate('products.product'); // Traemos productos con 'populate'
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
    const product = await Product.findById(pid);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productInCart = cart.products.find(p => p.product.toString() === pid);

    if (productInCart) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      productInCart.quantity += 1;
    } else {
      // Si no está, lo agregamos al carrito
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    // Emitimos el evento por WebSocket para actualizar el carrito en tiempo real
    io.emit('cartUpdated', await Cart.findById(cid).populate('products.product'));

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      error: 'Error al agregar producto al carrito',
      details: error.message,
    });
  }
});

// Ruta PUT /:cid/products/:pid - Actualizar cantidad de producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body; // La cantidad viene desde el cuerpo de la solicitud

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      // Si el producto está en el carrito, actualizamos la cantidad
      productInCart.quantity = quantity;
      await cart.save();
      io.emit('cartUpdated', await Cart.findById(cid).populate('products.product'));
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar la cantidad del producto en el carrito',
      details: error.message,
    });
  }
});

// Ruta DELETE /:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Filtrar el producto que se quiere eliminar
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    io.emit('cartUpdated', await Cart.findById(cid).populate('products.product'));

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el producto del carrito',
      details: error.message,
    });
  }
});

// Ruta DELETE /:cid - Eliminar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const wasDeleted = await Cart.findByIdAndDelete(cid);
    
    if (wasDeleted) {
      res.json({ message: `Carrito con ID ${cid} eliminado exitosamente` });
      // Emitimos el evento de eliminación por WebSocket
      io.emit('cartDeleted', cid);
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

const mongoose = require('mongoose');

// Esquema del carrito con referencia a productos
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

class CartManager {
  async getCarts() {
    return await Cart.find().populate('products.product');
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product.equals(pid));
    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }
    await cart.save();
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();
    return cart;
  }

  async updateCart(cid, products) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = products;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product.equals(pid));
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
    }
    return cart;
  }

  async deleteCart(cid) {
    return await Cart.findByIdAndDelete(cid);
  }
}

module.exports = CartManager;

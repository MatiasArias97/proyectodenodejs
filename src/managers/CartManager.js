const fs = require('fs').promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si no existe el archivo, retorna un arreglo vacío
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // Actualizado para permitir sumar cantidad (por defecto 1)
  async addProductToCart(cid, pid, quantity = 1) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex === -1) {
      // Agrega el producto con la cantidad indicada
      cart.products.push({ product: pid, quantity: quantity });
    } else {
      // Incrementa la cantidad existente
      cart.products[productIndex].quantity += quantity;
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }

  // Nuevo método para eliminar un producto del carrito
  async removeProductFromCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex === -1) return cart; // Si no se encuentra, no se modifica

    // Elimina el producto del carrito
    cart.products.splice(productIndex, 1);

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }

  // Método para eliminar un carrito por ID
  async deleteCart(cartId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex(cart => cart.id === cartId);
      if (cartIndex === -1) {
        return null; // Carrito no encontrado
      }
      carts.splice(cartIndex, 1); // Elimina el carrito
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return true; // Eliminado con éxito
    } catch (error) {
      throw new Error('Error al eliminar el carrito');
    }
  }
}

module.exports = CartManager;
const Product = require('../models/productModel'); // Importa el modelo Product

class ProductManager {
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error('Error al guardar el producto: ' + error.message);
    }
  }

  async getProducts(filter = {}, options = {}) {
    try {
      return await Product.paginate(filter, options); // Paginación, filtros y ordenamiento
    } catch (error) {
      throw new Error('Error al obtener los productos: ' + error.message);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error('Error al obtener el producto: ' + error.message);
    }
  }
}

module.exports = ProductManager;

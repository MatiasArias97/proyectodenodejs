const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts(limit) {
    const data = await fs.readFile(this.path, 'utf-8');
    const products = JSON.parse(data);
    return limit ? products.slice(0, limit) : products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: Date.now().toString(), ...product, status: true };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id: products[index].id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}

module.exports = ProductManager;
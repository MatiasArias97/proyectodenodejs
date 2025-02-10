const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = Date.now().toString();
        products.push(product);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id.toString() !== id.toString());
        await fs.writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2));
        
    }
    
}

module.exports = ProductManager;
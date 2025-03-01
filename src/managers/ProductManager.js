const mongoose = require('mongoose');

// Esquema de Producto con Mongoose
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

class ProductManager {
    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            await Product.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }
}

module.exports = ProductManager;
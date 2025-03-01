const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('./data/products.json');

// Ruta para mostrar productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', { title: 'Productos en Tiempo Real' });
});

// Ruta para obtener productos con paginación, filtros y ordenamiento
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort, priceRange } = req.query;

        // Paginación y Filtros
        const query = {};
        if (category) query.category = category;
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-');
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        // Ordenamiento
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOptions[field] = order === 'desc' ? -1 : 1;
        }

        // Obtener productos con los filtros y ordenamiento
        const products = await productManager.getProducts(query, parseInt(limit), parseInt(page), sortOptions);
        res.json(products); // Devuelve los productos con paginación, filtros y ordenamiento
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los productos',
            details: error.message,
        });
    }
});

// Socket.IO para manejar eventos de productos en tiempo real
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        // Enviar los productos al cliente cuando se conecta
        productManager.getProducts().then((products) => {
            socket.emit('updateProducts', products);
        });

        // Evento para agregar un nuevo producto
        socket.on('newProduct', async (product) => {
            await productManager.addProduct(product);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts); // Emitir a todos los clientes conectados
        });

        // Evento para eliminar un producto
        socket.on('deleteProduct', async (id) => {
            await productManager.deleteProduct(id);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts); // Emitir a todos los clientes conectados
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
};

module.exports.router = router;
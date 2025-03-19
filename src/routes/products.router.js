const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

// Ruta para obtener productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        
        // Configurar filtros de búsqueda
        const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
        
        // Configurar opciones de paginación y ordenamiento
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };
        
        const products = await productManager.getProducts(filter, options);
        res.json(products); // Devuelve los productos con paginación, filtros y ordenamiento
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los productos',
            details: error.message,
        });
    }
});

// Ruta para obtener un producto específico por su ID
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ message: 'Error obteniendo producto' });
    }
});

// Ruta para agregar un producto
router.post('/', async (req, res) => {
    try {
        const { title, price, description, category, available } = req.body;
        
        if (!title || !price || !description || !category || available === undefined) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const newProduct = await productManager.addProduct({ title, price, description, category, available });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ message: 'Error al agregar el producto', details: error.message });
    }
});

module.exports = router;

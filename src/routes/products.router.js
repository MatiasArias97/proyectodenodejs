const express = require('express');
const router = express.Router();

// Ruta para mostrar productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', { title: 'Productos en Tiempo Real' });
});

module.exports = router;
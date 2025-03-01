const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo de productos
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      }
    }
  ]
});

// Usamos "populate" automáticamente al realizar consultas
cartSchema.pre('find', function () {
  this.populate('products.product');
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
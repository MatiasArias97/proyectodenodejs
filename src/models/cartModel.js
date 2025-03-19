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
        min: [1, 'La cantidad debe ser al menos 1'], // Validación para asegurar que la cantidad no sea menor que 1
      },
    },
  ],
});

cartSchema.methods.populateProducts = async function () {
  await this.populate('products.product').execPopulate();
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;
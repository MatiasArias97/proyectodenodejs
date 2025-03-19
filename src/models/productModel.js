const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // Si usas paginación

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

productSchema.plugin(mongoosePaginate); // Plugin para paginación

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

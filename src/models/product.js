const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Колекція в Atlas: products
module.exports = mongoose.model('Product', productSchema);

const express = require('express');
const Product = require('../models/product');

const router = express.Router();

// Сторінка зі списком товарів (читання з MongoDB Atlas через Mongoose, ДЗ 65.1)
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.render('products', { products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

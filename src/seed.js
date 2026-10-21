require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/product');

const items = [
  { name: 'Неон блакитний', category: 'fish', price: 25, description: 'Зграйна рибка, 3–4 см' },
  { name: 'Гупі', category: 'fish', price: 20, description: 'Невибаглива живородна рибка' },
  { name: 'Анубіас', category: 'plants', price: 80, description: 'Тіньовитривала рослина' },
  { name: 'Фільтр внутрішній', category: 'equipment', price: 450, description: 'Для акваріума до 100 л' },
];

(async () => {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`У колекції вже є ${count} документів — seed пропущено.`);
    } else {
      await Product.insertMany(items);
      console.log(`Додано ${items.length} товарів.`);
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();

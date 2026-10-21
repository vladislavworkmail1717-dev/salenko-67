const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI не задано в .env');

  await mongoose.connect(uri);
  console.log(`MongoDB Atlas підключено, база: ${mongoose.connection.name}`);
}

module.exports = connectDB;

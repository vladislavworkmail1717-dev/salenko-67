const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Сервер: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Помилка підключення до MongoDB:', err.message);
    process.exit(1);
  });

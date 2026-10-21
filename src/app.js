require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');

require('./config/passport');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const productsApi = require('./routes/productsApi');
const { ensureAuth } = require('./middleware/auth');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// За проксі (Vercel/Render) потрібно, щоб secure-cookie працювала
if (isProd) app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd, // true тільки на HTTPS (у production)
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 днів
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Доступ до user у всіх шаблонах
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => res.render('index'));
app.use('/', authRoutes);
app.use('/', productRoutes);

// ДЗ 66.1: CRUD API для колекції products (нативний драйвер MongoDB)
app.use('/api/products', productsApi);

app.get('/protected', ensureAuth, (req, res) => {
  res.render('protected');
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Маршрут не знайдено' });
  res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
  if (req.path.startsWith('/api/')) {
    if (err.type === 'entity.parse.failed')
      return res.status(400).json({ error: 'Некоректний JSON у тілі запиту' });
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
  console.error(err);
  res.status(500).send('Server error');
});

module.exports = app;

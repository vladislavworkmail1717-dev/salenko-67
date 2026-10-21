const express = require('express');
const passport = require('passport');
const Users = require('../models/users');
const { ensureGuest, ensureAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/register', ensureGuest, (req, res) =>
  res.render('register', { error: null })
);

router.post('/register', ensureGuest, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).render('register', { error: 'Заповніть усі поля' });
    if (password.length < 6)
      return res.status(400).render('register', { error: 'Пароль мінімум 6 символів' });
    if (Users.findByEmail(email))
      return res.status(409).render('register', { error: 'Такий email уже зареєстровано' });

    const user = await Users.create({ name, email, password });

    // Одразу логінимо після реєстрації
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/protected');
    });
  } catch (err) {
    next(err);
  }
});

router.get('/login', ensureGuest, (req, res) =>
  res.render('login', { error: null })
);

router.post('/login', ensureGuest, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).render('login', { error: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/protected');
    });
  })(req, res, next);
});

// POST, щоб вихід не можна було викликати посиланням з чужого сайту
router.post('/logout', ensureAuth, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;

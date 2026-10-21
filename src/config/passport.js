const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = Users.findByEmail(email);
      if (!user) return done(null, false, { message: 'Невірний email або пароль' });

      const ok = await Users.verifyPassword(user, password);
      if (!ok) return done(null, false, { message: 'Невірний email або пароль' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// У сесію кладемо тільки id
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  const user = Users.findById(id);
  done(null, user || false);
});

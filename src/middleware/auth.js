function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/protected');
}

module.exports = { ensureAuth, ensureGuest };

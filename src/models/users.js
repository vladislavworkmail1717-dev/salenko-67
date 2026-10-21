const bcrypt = require('bcryptjs');

const users = []; // сховище в пам'яті (для ДЗ достатньо)
let nextId = 1;

const findByEmail = (email) =>
  users.find((u) => u.email === String(email).toLowerCase().trim());

const findById = (id) => users.find((u) => u.id === id);

async function create({ name, email, password }) {
  const user = {
    id: nextId++,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(password, 10),
  };
  users.push(user);
  return user;
}

const verifyPassword = (user, password) =>
  bcrypt.compare(password, user.passwordHash);

module.exports = { findByEmail, findById, create, verifyPassword };

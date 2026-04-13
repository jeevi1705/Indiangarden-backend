const jwt = require('jsonwebtoken');

const generateToken = (id, name = 'User', isAdmin = false) => {
  return jwt.sign({ id, name, isAdmin }, process.env.JWT_SECRET || 'supersecretkey123', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
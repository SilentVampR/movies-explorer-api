const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const secret = NODE_ENV === 'production' ? JWT_SECRET : 'some-dev-secret';

const AuthError = require('../errors/auth-err');

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthError('Ошибка авторизации');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (e) {
    throw new AuthError('Ошибка авторизации');
  }
  req.user = payload;
  return next();
};

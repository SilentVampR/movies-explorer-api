const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const RequestError = require('../errors/request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getErrors = (data) => Object.values(data.errors).map((error) => error.message);

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new RequestError('Не все обязательные поля заполнены');
  }
  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return bcrypt.hash(password, 10);
      }
      throw new ConflictError('Пользователь с таким email уже зарегистрирован');
    })
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          const newUser = user.toObject();
          delete newUser.password;
          res
            .status(201)
            .send({ data: newUser });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new RequestError(`Не все поля заполены корректно: ${getErrors(err)}`));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректное значение ID пользователя'));
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректное значение ID пользователя'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res
        .status(202)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Не все поля заполены корректно: ${getErrors(err)}`));
      }
      next(err);
    });
};

module.exports.signin = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверный логин или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthError('Неверный логин или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-dev-secret',
            { expiresIn: '7d' },
          );
          return res
            .status(200)
            .cookie('jwt', token, {
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в мс
              httpOnly: true,
              // sameSite: true,
              sameSite: 'none',
              secure: true,
            })
            .send({ email });
          // .end();
        })
        .catch(next);
    })

    .catch(next);
};

module.exports.signout = (req, res) => res
  .status(200)
  .clearCookie('jwt', {
    path: '/',
  })
  .send({ message: 'Осуществлен выход из приложения' });

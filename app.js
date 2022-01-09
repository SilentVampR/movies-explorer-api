require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { corsConfig } = require('./middlewares/corsconfig');

const {
  createUser,
  signin,
  signout,
} = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorhandler');
// const { urlPattern } = require('./helpers/patterns');

const NotFoundError = require('./errors/not-found-err');

// Импортируем маршруты
const { auth } = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const { PORT = 3002 } = process.env;

const app = express();

app.use(requestLogger); // Логгер запросов

app.use(cookieParser()); // Работа с cookie

app.use(helmet()); // Активируем helmet
app.disable('x-powered-by'); // Отключаем заголовок принадлежности

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 90,
  legacyHeaders: false,
});
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(corsConfig);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);
app.get('/signout', signout);
app.use(auth);
app.use(userRoutes);
app.use(movieRoutes);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту', PORT);
});

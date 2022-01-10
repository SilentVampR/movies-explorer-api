require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');

const { db, PORT } = require('./config/config');

const { corsConfig } = require('./middlewares/corsconfig');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorhandler');
// const { urlPattern } = require('./helpers/patterns');

const NotFoundError = require('./errors/not-found-err');

// Импортируем маршруты
const signRoutes = require('./routes/sign');
const { auth } = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

// const { PORT = 3002 } = process.env;

const app = express();

app.use(requestLogger); // Логгер запросов

app.use(cookieParser()); // Работа с cookie

app.use(helmet()); // Активируем helmet
app.disable('x-powered-by'); // Отключаем заголовок принадлежности

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/moviesdb');
mongoose.connect(`mongodb://${db.address}:${db.port}/${db.name}`);

app.use(corsConfig);

app.use(signRoutes);
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

const Movie = require('../models/movie');

const RequestError = require('../errors/request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getErrors = (data) => Object.values(data.errors).map((error) => error.message);

module.exports.createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    movieId,
    thumbnail,
    trailer,
    image,
    description,
    year,
    duration,
    director,
    country,
  } = req.body;
  const ownerId = req.user._id;

  Movie.create({
    nameRU,
    nameEN,
    movieId,
    owner: ownerId,
    thumbnail,
    trailer,
    image,
    description,
    year,
    duration,
    director,
    country,
  })
    .then((movie) => res
      .status(201)
      .send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Не все поля заполены корректно: ${getErrors(err)}`));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .sort({ createdAt: -1 })
    .then((movies) => res
      .status(200)
      .send({ data: movies }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      const ownerId = movie.owner._id.toString();
      if (ownerId !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения данного действия');
      }
      return movie.remove()
        .then(() => res
          .status(202)
          .send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные для удаления фильма'));
      } else {
        next(err);
      }
    });
};

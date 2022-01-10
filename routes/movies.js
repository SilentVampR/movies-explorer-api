const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../helpers/validation');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
    movieId: Joi.number().required(),
    thumbnail: Joi.string().required().custom(validateUrl),
    trailer: Joi.string().required().custom(validateUrl),
    image: Joi.string().required().custom(validateUrl),
    description: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;

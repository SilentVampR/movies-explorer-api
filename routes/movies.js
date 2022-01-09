const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlPattern } = require('../helpers/patterns');
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
    moviId: Joi.string().required(),
    thumbnail: Joi.string().uri().required().pattern(urlPattern),
    trailer: Joi.string().uri().required().pattern(urlPattern),
    image: Joi.string().uri().required().pattern(urlPattern),
    description: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:cardId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;

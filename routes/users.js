const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserById,
  updateUser,
  getMe,
} = require('../controllers/users');

router.get('/users/me', getMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;

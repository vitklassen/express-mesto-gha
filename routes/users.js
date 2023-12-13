const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getAllUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }).unknown(true),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = router;

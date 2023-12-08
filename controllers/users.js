const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new ServerError('Ошибка на сервере');
      }
      res.send({ data: users });
    })
    .catch(err => next(err));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 5)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        res.status(http2.constants.HTTP_STATUS_CREATED).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
          return;
        }
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      res.send({ data: userAvatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const User = require('../models/user');
const http2 = require('http2');
module.exports.getAllUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send({data: users});
  })
  .catch((err) => {
    if(err.name == "CastError") {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: err.message});
      return
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  })
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if(!user) {
      res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: 'Запрашиваемый пользователь не найден'});
      return
    }
    res.send({data: user});
  })
  .catch((err) => {
    console.log(err.name);
    if(err.name == "CastError"){
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: err.message});
      return
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  })
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
  .then((user) => {
    res.send({data: user});
  })
  .catch((err) => {
    if(err.name == "ValidationError"){
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: err.message});
      return
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }) 
}

module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
  .then((user) => {
    res.send({data: user})
  })
  .catch((err) => {
    if(err.name == "ValidationError"){
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: err.message});
      return
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  })
}

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
  .then((avatar) => {
    res.send({data: avatar})
  })
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка' });
  })
}
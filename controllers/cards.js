const Card = require("../models/card");
const http2 = require("http2");
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name == "CastError") {
        res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Ошибка на сервере" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Ошибка на сервере" });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name == "CastError") {
        res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Ошибка на сервере" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name == "CastError") {
        res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Ошибка на сервере" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name == "CastError") {
        res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Ошибка на сервере" });
    });
};

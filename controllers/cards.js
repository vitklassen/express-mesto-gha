const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
  .then((cards) => {
    res.send({data: cards});
  })
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка' });
  })
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
  .then((card) => {
    res.send({data: card});
  })
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка' });
  })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    res.send({data: card});
  })
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка' });
  })
}

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)


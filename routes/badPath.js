const router = require('express').Router();
const ServerError = require('../errors/ServerError');

function setBadPathError(req, res, next) {
  return next(new ServerError('Ошибка сервера'));
}

router.all('/', setBadPathError);
module.exports = router;

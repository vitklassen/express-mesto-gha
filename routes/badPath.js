const router = require('express').Router();
const http2 = require('http2');

function setBadPathError(req, res) {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Неверный путь' });
}

router.all('/', setBadPathError);
module.exports = router;

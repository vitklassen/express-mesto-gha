const router = require('express').Router();
const http2 = require("http2");
function setBadPathError(req, res) {
    res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: "Неверный путь" });
}

router.get('/', setBadPathError);
router.post('/', setBadPathError);
router.patch('/', setBadPathError);
router.delete('/', setBadPathError);
router.put('/', setBadPathError);

module.exports = router;
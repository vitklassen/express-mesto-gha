const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limit = rateLimiter({
  windowMs: 50000,
  limit: 10000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL).then(() => { console.log('MongoDB is connected'); });
app.use(bodyParser.json());
app.use(helmet());
app.use(limit);
app.use(requestLogger);
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', require('./routes/badPath'));

app.use(errorLogger);
app.use(errors());
app.use(require('./middlewares/error-handlers'));

app.listen(PORT, () => {
  console.log('Server is connected');
});

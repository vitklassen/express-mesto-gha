const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handlers');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL).then(() => { console.log('MongoDB is connected'); });
app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object.keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object.keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(helmet());

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));
app.use('*', require('./routes/badPath'));

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server is connected');
});

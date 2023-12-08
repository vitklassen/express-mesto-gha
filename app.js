const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handlers');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL).then(() => { console.log('MongoDB is connected'); });
app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(helmet());

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));
app.use('*', require('./routes/badPath'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server is connected');
});

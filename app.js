const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {console.log('MongoDB is connected')});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '65684526c1f958cd3fd1d502'
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.listen(PORT, () => {
  console.log('Server is connected');
});
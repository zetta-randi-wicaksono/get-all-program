const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/';
const database = 'get_all_program';

const conn = mongoose
  .connect(`${url}${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    return 'Connected to ' + database;
  })
  .catch((error) => {
    return 'Error Connecting to MongoDB: ', error;
  });

module.exports = conn;

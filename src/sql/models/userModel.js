const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  password: String
});

const Users = mongoose.model('User', userSchema);

module.exports = Users
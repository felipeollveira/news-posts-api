const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  });

  const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;
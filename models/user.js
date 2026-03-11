const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  pwd: String,
  token: [String],
});

const User = mongoose.model('users', userSchema);

module.exports = User;

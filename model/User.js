const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please, provide a name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'please, provide a email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'please, provide a password'],
    minlength: 3,
  },
  role: String,
  enum: ['admin', 'user'],
  default: user,
});

module.exports = mongoose.model('User', UserSchema);

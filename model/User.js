const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true, // to check if this email was not used
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// read more later on solt
UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths()); <= shows modified paths
  // console.log(this.isModified('name'));  <= shows if particular paths was modified
  if (!this.isModified('password')) return;
  // and you need nothing else becouse we do not need any functionality when it comes to
  // name or email change
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// read more later on this
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);

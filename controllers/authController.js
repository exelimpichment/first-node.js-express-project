const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createJWT } = require('../utils/index');
// const jwt = require('jsonwebtoken');  <=  migrated to jwt.js
const register = async (req, res) => {
  const { email, name, password } = req.body;

  const isEmailExist = await User.findOne({ email });
  //another way to check is mail is already in use except for
  //  _unique: true_ field in User model
  if (isEmailExist) {
    throw new CustomError.BadRequestError('Email already exist');
  }
  // to control that role is always _user_ not admin
  // role can be changed to admin manually via mangoDB or
  // using other dashboard application or smth like this
  const user = await User.create({ name, email, password });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  // const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_LIFETIME,
  // });  <= replaced with the next line of code
  const token = createJWT({ payload: tokenUser });
  // res.status(StatusCodes.CREATED).json({ user: tokenUser, token }); <= this variant is for local storage token placement
  const oneDayTime = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDayTime),
  });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
const login = async (req, res) => {
  res.send('login user');
};
const logout = async (req, res) => {
  res.send('logout user');
};

module.exports = { register, login, logout };

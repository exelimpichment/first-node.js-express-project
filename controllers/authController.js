const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createToken } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    throw new CustomError.BadRequestError('Email already exist');
  }
  const user = await User.create({ name, email, password });

  const tokenUser = createToken(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser }); // <= can be placed inside attach cookies
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide login and password');
  }
  const user = await User.findOne({ email }); // <= this is instance of Model

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password); //<= instance has _comparePassword_ method (declared in User model)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const tokenUser = createToken(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out' }); // <= no need to send this
  // this is only for testing to see some response.
  // front end does not need this
};

module.exports = { register, login, logout };

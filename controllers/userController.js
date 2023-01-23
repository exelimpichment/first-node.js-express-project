const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUsers = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  // if (!user) {
  //   console.log('ok');

  //   throw new CustomError.NotFoundError(`No user with id:  ${req.params.id}`);
  // }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUsers = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  res.send(req.body);
};

const updateUserPassword = async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    console.log(1);
    throw new CustomError.BadRequestError('Please, provide both passwords');
  }
  console.log(2);
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    console.log(3);
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  user.password = newPassword;
  user.save(); // <= read more about this(it goes through pre save in User model)
  res.status(StatusCodes.OK).json({ msg: 'Password Updated!' });
  console.log('test');
};

module.exports = {
  getAllUsers,
  getSingleUsers,
  showCurrentUsers,
  updateUser,
  updateUserPassword,
};

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
  res.send(req.body);
};

module.exports = {
  getAllUsers,
  getSingleUsers,
  showCurrentUsers,
  updateUser,
  updateUserPassword,
};

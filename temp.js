const Review = require('../model/Review');
const Product = require('../model/Product');

const { StatusCode } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermission } = require('../utils');

//*Create Review
const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`no such product ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError('already reviewed');
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCode.CREATED).json({ review });
};

//*Get All Reviews
const getAllReviews = async (req, res) => {
  res.send('Get All Reviews');
};

//*Get Single Review
const getSingleReview = async (req, res) => {
  res.send('Get Single Review');
};

//*Update Review
const updateReview = async (req, res) => {
  res.send('Update Review');
};

//*Delete Review
const deleteReview = async (req, res) => {
  res.send('Delete Review');
};

module.exports = {
  deleteReview,
  updateReview,
  getSingleReview,
  getAllReviews,
  createReview,
};

// !==================

const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please, provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please, provide review title'],
      maxlenght: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please, provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
//      ^every user has to be able to leave  only one review. read more on this.

module.export = mongoose.model('Review', ReviewSchema);

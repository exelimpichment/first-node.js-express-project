const Review = require('../model/Review');
const Product = require('../model/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

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
  res.status(StatusCodes.CREATED).json({ review });
};

//*Get All Reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  });

  //   .populate({
  //     path: 'user',
  //     select: 'name',
  //   });
  //^ #323 you can get other pieces of data out of connected Models
  //^ this is possible because we linked Review to Product / User (Review model knows where Product is)
  //^ but not vice versa
  //^ you need to use MongooseVirtuals for something like this.
  //^ MongooseVirtuals can be found in Product model

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

//*Get Single Review
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  //   .populate({
  //     path: 'product',
  //     select: 'name company price',
  //   });

  //   .populate({
  //     path: 'user',
  //     select: 'name',
  //   });
  //^you can use it on a single item either

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

//*Update Review
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

//*Delete Review
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Review Removed' });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  getSingleProductReviews,
  deleteReview,
  updateReview,
  getSingleReview,
  getAllReviews,
  createReview,
};

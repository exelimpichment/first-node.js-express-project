const Product = require('../model/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/');

// *createProduct Controller
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
}; //<== this is post route. everything should come in req.body

// *getAllProducts Controller
const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res;
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

// *getSingleProduct Controller
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  console.log(productId);
  const product = await Product.findOne({ _id: productId });
  console.log(product);
  if (!product) {
    console.log('ok');
    throw new CustomError.NotFoundError(`No product: ${productId}`);
  }

  console.log('not ok');
  res.status(StatusCodes.OK).json({ product });
};

// *updateProduct Controller
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

// *deleteProduct Controller
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success. Product removed' });
};

// *uploadImage Controller
const uploadImage = async (req, res) => {
  res.send('upload image');
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};

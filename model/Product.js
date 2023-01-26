const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please, provide product's name"],
      maxlength: [100, 'cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, "please, provide product's price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "please, provide product's description"],
      default: 0,
      maxlength: [1000, 'cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please, provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please, provide  company'],
      enum: {
        values: ['ikea', 'liddy', 'marcon'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "please, provide product's price"],
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId, // <== read about this more
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
  //^syntax after *timestemp* is a  step to allow model to accept virtuals
  //^ another part of syntax is located in productController.js - getSingleProduct function
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
  match: { rating: 5 }, //~<this will get only 5 star rating reviews
});
// ^ the problem with this we cannot query this.
// ^ we get a response in one piece
// ^ in order to be able to query we have to make a different setup
// ^ please, proceed to _reviewController_

ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});
// ^ we do not need reviews for product that we are about to delete

// ^326

module.exports = mongoose.model('Product', ProductSchema);

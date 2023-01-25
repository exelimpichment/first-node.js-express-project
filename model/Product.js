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
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);

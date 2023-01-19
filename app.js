require('dotenv').config();
console.log('test');

// getting express
const express = require('express');
const app = express();

// database
const connectDB = require('./db/connect');

const port = process.env.PORT || 5001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`listening to ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();

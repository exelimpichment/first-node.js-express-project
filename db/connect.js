const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = (url) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log('connected to db!'))
    .catch((e) => console.log(e));
};

module.exports = connectDB;

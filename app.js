require('dotenv').config();
require('express-async-errors');
// getting express
const express = require('express');
const app = express();

const morgan = require('morgan');
// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// this is used to reach json files in requests
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('lol');
});

app.use('api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
// mongoose.set('strictQuery', true);
// mongoose.set('strictQuery', false);

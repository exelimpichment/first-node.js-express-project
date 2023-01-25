require('dotenv').config();
require('express-async-errors');
// getting express
const express = require('express');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// this is used to reach json files in requests
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// app.get('/', (req, res) => {
//   console.log(req.cookies);
//   res.send('lol');
// });
// app.get('/api/v1', (req, res) => {
//   console.log(req.signedCookies);
//   res.send('lol');
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

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

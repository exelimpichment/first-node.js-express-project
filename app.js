require('dotenv').config();
require('express-async-errors');

// getting express
const express = require('express');
const app = express();
// const rateLimiter = require('express-rate-limit');
// const helmet = require('helmet');
// const xss = require('xss-clean');
const cors = require('cors');
// const mongoSanitize = require('express-mongo-sanitize');

// app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
// app.use(helmet());

app.use(
  cors({
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'https://ciuchy-frontend-pmee.vercel.app',
    ], // res.set('Access-Control-Allow-Origin', req.headers.origin);
    credentials: true, // res.set('Access-Control-Allow-Credentials', 'true');
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-csrf-token',
      'Origin',
      'X-Requested-With',
      'Content - Type',
      'Accept',
    ],
    optionsSuccessStatus: 204,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// app.use(mongoSanitize());
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const ExpressMongoSanitize = require('express-mongo-sanitize');

// this is used to reach json files in requests
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

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
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`listening to ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
// mongoose.set('strictQuery', true);
// mongoose.set('strictQuery', false);

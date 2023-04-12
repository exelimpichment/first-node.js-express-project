const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  // const oneDayTime = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    // secure: process.env.NODE_ENV === 'production',
    // secure: true,
    domain: 'first-node-js-express-project.onrender.com',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 * 365,
    signed: true, // <= has to be checked more details what *signed* mean
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};

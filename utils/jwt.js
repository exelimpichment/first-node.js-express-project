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

  const oneDayTime = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDayTime),
    secure: process.env.NODE_ENV === 'production',
    signed: true, // <= has to be checked more details what *signed* mean
  });

  // res.status(201).json({ user }); // <= we will remove
  // from here and place in authContrloer
  // since we will have to apply this function
  //  in different places later
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};

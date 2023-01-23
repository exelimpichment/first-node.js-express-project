const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

// middleware

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('authentication Invalid');
  }
  try {
    const payload = isTokenValid({ token });
    // console.log(payload);
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
  // -------------------------------
  // if (req.user.role !== 'admin') {
  //   throw new CustomError.UnauthorizedError('Unauthorized to access this');
  // }
  // next();
  // -------------------------------
  //  <= commented out since this works when we have 1 role
  //  that has access to this route. But what if we have - admin, owner, moderator, etc.
  // #302
};

module.exports = { authenticateUser, authorizePermissions };

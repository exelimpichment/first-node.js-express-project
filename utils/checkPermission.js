const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser); => { name: 'misha1', userId: '63d0082df3ad9fca344ca28d', role: 'user' }
  //   console.log(resourceUserId); => new ObjectId("63cfe6fed1e434e14c1892ef")
  //   console.log(typeof requestUser); => object
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthenticatedError(
    'Not authorized to access this route'
  );
};

module.exports = checkPermissions;

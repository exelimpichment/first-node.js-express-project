const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createToken = require('../utils/createTokenUser');
const checkPermissions = require('../utils/checkPermission');

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createToken,
  checkPermissions,
};

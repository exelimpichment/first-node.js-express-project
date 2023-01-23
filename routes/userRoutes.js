const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUsers,
  showCurrentUsers,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUsers); // <= get more info where to use this *show me* on front end
router.route('/updateUser').patch(updateUser);
router.route('/updatePassword').patch(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUsers);

module.exports = router;

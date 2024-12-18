const Router = require('express').Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');

const authController = require('../controllers/auth.controllers');

Router.route('/signup').get(authController.getSignup);

Router.route('/submit').post(authController.signup);

Router.route('/edit').get(authController.getUserEdit);

Router.route('/edit').post(updateUser);

Router.route('/forgotPassword').post(authController.forgotPassword);

Router.route('/resetPassword/:resetToken').patch(authController.resetPassword);


Router.route('/login').get(authController.getLogin);
Router.route('/submitLogin').post(authController.login);

Router.route('/').get(authController.protect, getAllUsers).post(createUser);

Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = Router;

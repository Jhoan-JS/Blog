const Router = require('express').Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');

const authController = require('../controllers/auth.controllers');

Router.route('/signup').post(authController.signup);

Router.route('/forgotPassword').post(authController.forgotPassword);

Router.route('/login').post(authController.login);

Router.route('/').get(authController.protect, getAllUsers).post(createUser);

Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = Router;

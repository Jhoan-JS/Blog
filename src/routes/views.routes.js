const Router = require('express').Router();

const viewsController = require('../controllers/viewsController');

Router.route('/posts').get(viewsController.getHome);

/*Router.route('/signup').get(viewsController.getSignup);*/

Router.route('/posts/:slug').get(viewsController.getPost);
module.exports = Router;

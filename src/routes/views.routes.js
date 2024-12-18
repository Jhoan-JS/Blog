const Router = require('express').Router();

const viewsController = require('../controllers/viewsController');
const postController = require('../controllers/post.controllers');
Router.route('/posts').get(viewsController.getHome);
Router.route('/posts').post(postController.createPost);
/*Router.route('/signup').get(viewsController.getSignup);*/

Router.route('/posts/:slug').get(viewsController.getPost);
module.exports = Router;

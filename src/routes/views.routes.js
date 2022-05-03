const Router = require('express').Router();

const viewsController = require('../controllers/viewsController');

Router.route('/home').get(viewsController.getHome);

Router.route('/posts/:slug').get(viewsController.getPost);
module.exports = Router;

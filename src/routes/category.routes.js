const Router = require('express').Router();
const categoryController = require('../controllers/category.controllers');

Router.route('/')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

Router.route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = Router;

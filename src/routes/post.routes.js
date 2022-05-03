const Router = require('express').Router();
const postController = require('../controllers/post.controllers');
const commentController = require('../controllers/comment.controllers');
const authController = require('../controllers/auth.controllers');

Router.route('/').get(postController.getPosts).post(postController.createPost);

Router.route('/:id')
  .get(postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);

//comments
Router.route('/:id/comments')
  .get(commentController.getCommentsByPost)
  .post(authController.protect, commentController.createComment);

// Router.route('/:id/comments/:commentsID').delete(
//   authController.protect,
//   authController.restrictTo('admin', 'mod'),
//   commentController.deleteComment
// );
module.exports = Router;

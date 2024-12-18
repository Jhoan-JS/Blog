const Router = require('express').Router();
const postController = require('../controllers/post.controllers');
const commentController = require('../controllers/comment.controllers');
const authController = require('../controllers/auth.controllers');

Router.route('/').get(postController.getPosts)

// Router.route('/create').post(postController.createPost);
/*Router.route('/:id')
  .get(postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);
*/


Router.route('/delete').post( postController.deletePost)
  .delete(postController.deletePost);

  Router.route('/update').post( postController.updatePost)

  

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

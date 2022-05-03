// const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');

exports.getCommentsByPost = catchAsync(async (req, res, next) => {
  const postID = req.params.id;

  const comments = await Comment.find({ post: postID });

  res.status(200).json({
    status: 'success',

    data: { comments },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const postID = req.params.id;
  const { content, parentCommentId, isReply } = req.body;

  const post = await Post.findById(postID);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const comment = await Comment.create({
    user: currentUser.id,
    content: content,
    post: postID,
    parentCommentId,
    isReply,
  });

  post.comments.push(comment.id);
  post.save();
  res.status(201).json({
    status: 'success',

    data: { comment },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const commentID = req.params.commentsID;
  const { id } = req.params;
  const deleteComment = await Comment.findByIdAndDelete(commentID);
  if (!deleteComment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  //delete comment on post model
  await Post.updateOne({ id }, { $pull: { comments: commentID } });

  res.status(200).json({
    status: 'success',

    data: null,
  });
});

const Post = require('../models/Post.model');

const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  //Execute the query
  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: { posts },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',

    data: { post },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const createdPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',

    data: { post: createdPost },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedPost) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',

    data: { post: updatedPost },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedPost = await Post.findByIdAndDelete(id);

  if (!deletedPost) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',

    data: null,
  });
});

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
  const { id } = req.body;
  console.log(req.body);
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
  console.log("dasdas");
  console.log(req.body);
  console.log(req.params);

  const { feeling, descr } = req.body;
  const author = user._id;
  console.log(author);
  const createdPost = new Post({ feeling, descr, author });
  await createdPost.save(function (err) {
    console.log(err);
  });

  const name = user.name;
  console.log("dasdsa");
  const posts = await Post.find({ author: user._id });
  console.log(posts);
  res.render('pages/home', { name, posts });


  // res.redirect("http://localhost/home");
  /*
    res.status(201).json({
      status: 'success',
  
      data: { post: createdPost },
    });*/
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  console.log(req.body)
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
  const { id } = req.body;
  console.log(req.body);

  const deletedPost = await Post.findByIdAndDelete(id);

  if (!deletedPost) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',

    data: null,
  });
});

// exports.getHome = (req, res) => {
//   res.render('home');
// };
const Post = require('../models/Post.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getHome = catchAsync(async (req, res, next) => {
  console.log(user);
  const posts = await Post.find();
  

  res.status(200).render('pages/home', {
    title: 'All Posts',
    posts,
  });
});


exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate({
      path: 'categories',
      select: 'name',
    })
    .populate({
      path: 'comments',
      select: 'user content date parentCommentId isReply',
      populate: {
        path: 'user',
        select: 'name',
      },
    });

  // post.comments.forEach((comment, index) => {
  //   if (comment.isReply) {
  //     replies.push(comment);
  //     post.comments.splice(index, 1);
  //   }
  // });

  post.replies = post.comments.filter((comment) => comment.isReply === true);
  post.comments = post.comments.filter((comment) => comment.isReply === false);
  console.log(post.replies);

  // Object.assign(post, { replies: replies });
  if (!post) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // console.log(post);
  res.render('pages/posts/post', {
    title: `${post.title} Post`,
    post,
  });
});

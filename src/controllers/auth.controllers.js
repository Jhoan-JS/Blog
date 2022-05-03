const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Comment = require('../models/Comment.model');
const sendEmail = require('../utils/Email');
// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in!!'), 401);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user beloging to this token does not longer exists'),
      401
    );
  }

  //Implemented this later
  // 4) check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  req.user = currentUser;
  next();
});

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    //If is a user that is trying delete this comment and it not was created by herself
    // const user = req.user.id;
    // const commentOwnerByUser = await Comment.findOne({
    //   id: req.params.commentsID,
    //   user,
    // });
    // console.log(commentOwnerByUser);
    if (roles.includes(req.user.role)) {
      return next();
    }

    next(
      new AppError('You do not have permission to perform this action ', 403)
    );
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 ) get User based on posted email
  const user = await User.findOne({ email: req.body.email });
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH rrequest with your new password and passwordConfirm to: ${resetURL}.\n If you din't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 min',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later', 500)
    );
  }

  //
});

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   // 1) get user basend on the token
//
//   //2 if token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new AppError('Token is invalid or has experied'), 400);
//   }

//   //3 Update changePasswordAt property for the user
//   //4) log the user in,SendJWT
//
// });

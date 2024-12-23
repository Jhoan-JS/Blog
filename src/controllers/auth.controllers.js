const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Comment = require('../models/Comment.model');
const sendEmail = require('../utils/Email');
const bcrypt = require('bcryptjs');
const Post = require('../models/Post.model');
// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getSignup= catchAsync(async (req, res, next) => {
  /*const posts = await Post.find();*/
  console.log("vete");
  res.status(200).render('pages/signup',{ errorMessage: "" });
 });

 exports.getUserEdit = catchAsync(async (req, res, next) => {
  /*const posts = await Post.find();*/
  
  res.status(200).render('pages/user/user-profile-edit',{user,success:"",anchor:"#personal-information"});
 });


 
 exports.getLogin= catchAsync(async (req, res, next) => {
  /*const posts = await Post.find();*/
 
  res.status(200).render('pages/auth/login', { errorMessage:"" });
 });
 

exports.signup = catchAsync(async (req, res, next) => {

  const { name, lastname, email, password, Confirmpassword } = req.body;
console.log(req.body);

 // Validación de datos de entrada
 if (!name || !lastname || !email || !password || !Confirmpassword) {
 
  console.log("dsada");
  return res.render('pages/signup', { errorMessage: 'Todos los campos son obligatorios.' });
}

// Validación de contraseñas
if (password !== Confirmpassword) {

  return res.render('pages/signup', { errorMessage: 'Las contraseñas no coinciden.' });
}

// Validación de formato de correo electrónico
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
 

  return res.render('pages/signup', { errorMessage: 'Correo electrónico no válido.' });
}

// Verificación si el correo electrónico ya está registrado
const userExists = await User.findOne({ email });
if (userExists) {
  return res.render('pages/signup', { errorMessage: 'Este correo electrónico ya está registrado.' });
 
}


 
  console.log(name);
  console.log(lastname);
  console.log(email);
  

    
    const newUser = new User({
      name,lastname,
      email,
      password
    });
  
    
    /*const newUser = await User.create({
      name,lastname,
      email,
      password,
      Confirmpassword,
    });*/
    await newUser.save();
    console.log(newUser);

  
  
 
/*
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });*/
 

   res.render('pages/auth/login', { errorMessage: '' });
  /*res.render('success', { name }); // Renderiza una página de éxito*/
});

exports.login = catchAsync(async (req, res, next) => {
  console.log( req.body);
  const { email, password } = req.body;

  if (!email || !password) {

    return res.render('pages/auth/login', { errorMessage: 'Digite un email y la contraseña' });
  }

  if ( !password) {

    return res.render('pages/auth/login', { errorMessage: 'Digite  la contraseña' });
  }

  if ( !email ) {

    return res.render('pages/auth/login', { errorMessage: 'Digite el email' });
  }
 
 
  const user = await User.findOne({ email }).select('+password');
  console.log( user.password);
  /*if (!user || !(await user.correctPassword(password, user.password))) {
  
    return next(new AppError('Incorrect email or password', 401));
    console.log( req.body);
  }*/

    if (!user || !(user.password===password)) {
      return res.render('pages/auth/login', { errorMessage: 'Email o contraseña incorrecta' });
     
      ;
    }
    console.log( "req.body");
    global.user = user;
  const token = signToken(user._id);
  const name = user.name;
  console.log(user._id);
  const posts = await Post.find({author:user._id});
  console.log(posts);
  res.status(200).render('pages/home',{name,posts});
  /*res.status(201).json({
    status: 'success',
    token,
  });*/
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

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user basend on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  const { password, passwordConfirm } = req.body;
  //2 if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has experied'), 400);
  }

  //3 Update changePasswordAt property for the user
  //
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  console.log(password);
  await user.save();
  //4) log the user in,SendJWT
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

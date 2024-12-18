// Configuración de almacenamiento en memoria

var fs = require('fs');
var path = require('path');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users: users },
  });
});

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(
    obj.forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
  );

  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use updatedMyPassword',
        400
      )
    );
  }

  const filteredBody = filteredObj(req.body, 'name', 'email');
});

exports.getUser = (req, res) => {
  if (!req.user) {
    return next(new AppError('There not user login'));
  }

  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = catchAsync(async (req, res, next) => {

  console.log(req.body);


  try {
    if (req.body.contraActual === undefined) {
      // Convertir la imagen a Buffer (ya está en req.file.buffer)
      
      const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true });
      console.log(req.body);

      console.log(updatedUser);
      res.render('pages/user/user-profile-edit', { user: updatedUser, success: "true" });
    } else {
      console.log(req.body);
      if (req.body.contraActual === user.password) {
        console.log("primero si");
        if (req.body.password === req.body.ConfimPassword){
          console.log("segundo si");
          const updatedUser = await User.findByIdAndUpdate(user._id, {password : req.body.password}, { new: true });
   
  
          console.log(updatedUser);
          res.render('pages/user/user-profile-edit', { user: updatedUser, success: "true",anchor:"#chang-pwd" });
        }else{
          res.render('pages/user/user-profile-edit', { user, success: "false" ,anchor:"#chang-pwd" });
        }
        
      } else {
        res.render('pages/user/user-profile-edit', { user, success: "false" ,anchor:"#chang-pwd" });
      }


    }

  } catch (error) {
    console.error(error);
    res.render('pages/user/user-profile-edit', { user, success: "false" });
  }





});
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

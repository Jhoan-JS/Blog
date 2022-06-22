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
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

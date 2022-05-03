const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very  wrong!',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}. Please use another`;

  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const value = err.message.match(/"(.*?)"/)[1];
  const message = `Duplicate field value: ${value}. Please use another`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  let { message } = err;
  message = message.replace('Validation failed', 'Invalid input data');
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    const { name, message } = err;
    let error = { ...err };
    error.message = message;
    error.name = name;

    if (name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (name === 'ValidationError') {
      console.log('yes');
      error = handleValidatorError(error);
    } else if (error.code === 11000) {
      error = handleDuplicateError(error);
    }
    sendErrorProd(error, res);
  }
};

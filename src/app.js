const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const postRoutes = require('./routes/post.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const viewRoutes = require('./routes/views.routes');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/error.controllers');

//Initialization
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Middlaware
app.use(morgan('dev'));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



app.use(express.json());


//Routes
app.use('/', viewRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/user', userRoutes);

//Handling Unhandle routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  // const error = new Error(`Can't find ${req.originalUrl}`);

  // error.status = 'fail';
  // error.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
//Global error handler

app.use(globalErrorHandler);

module.exports = app;

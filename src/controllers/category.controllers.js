const Category = require('../models/Category.model');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',

    data: { category },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const createdCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',

    data: { category: createdCategory },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',

    data: { category: updatedCategory },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deleteCategory = await Category.findByIdAndDelete(id);

  if (!deleteCategory) {
    return next(new AppError('No category found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',

    data: null,
  });
});

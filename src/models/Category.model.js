const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A category must have a name.'],
  },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;

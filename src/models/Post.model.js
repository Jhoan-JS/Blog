const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A post must have a title.'],
  },
  slug: String,
  createAt: {
    type: Date,
    default: Date.now(),
  },

  summary: {
    type: String,
    trim: true,
    required: [true, 'A post must have a summary'],
  },

  description: {
    type: String,
    trim: true,
    required: [true, 'A post must have a description'],
  },

  imageCover: {
    type: String,
    required: [true, 'A post must have a cover image '],
  },

  active: {
    type: Boolean,
    default: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },

  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

PostSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

//change date format
// PostSchema.post('find', function (next) {
//   next();
// });

PostSchema.methods.changeDateFormat = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;

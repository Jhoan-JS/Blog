const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  content: {
    type: String,
    trim: true,
    required: [true, 'A comment must have a content'],
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: false,
  },

  isReply: {
    type: Boolean,
    default: false,
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;

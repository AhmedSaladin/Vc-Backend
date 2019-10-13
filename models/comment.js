const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: String,
  creator: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  post: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts'
    }
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts'
  ]
});

module.exports = mongoose.model('posts', commentSchema);

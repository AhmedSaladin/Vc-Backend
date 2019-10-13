const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: String,
  likes: Number,
  creator: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts'
    }
  ]
});

module.exports = mongoose.model('posts', PostSchema);

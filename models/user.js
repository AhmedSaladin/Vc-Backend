const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  orgnization: {
    type: Boolean,
    required: true,
    default: false
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts'
    }
  ],

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'events'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'users'
    }
  ],
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'users'
    }
  ],
  avatar: {
    type: String,
    required: true,
    default: 'http://quotepixel.com/images/authors/170w/unknown_quotes.jpg'
  }
});
module.exports = mongoose.model('users', userSchema);

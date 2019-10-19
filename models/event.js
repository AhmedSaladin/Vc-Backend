const mongoose = require('mongoose');

// creat event schema
const eventSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  description: String,
  image: String,
  creator: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  going: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'users'
    }
  },
  not_interested: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'users'
    }
  },
  interested: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'users'
    }
  }
});

module.exports = mongoose.model('events', eventSchema);

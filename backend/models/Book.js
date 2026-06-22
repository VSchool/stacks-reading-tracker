const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['reading', 'finished', 'want'],
    default: 'want',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  coverUrl: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);

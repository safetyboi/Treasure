const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  location: [{
    xCoord: {
        type: Number,
        required: true
    },
    yCoord: {
        type: Number,
        required: true
    },
  }],
  order: {
    type: Number,
    required: true
  },
  clue: [{
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
  }],
  answer: [{
    text: {
        type: String
    },
    image: {
        type: String
    },
  }],
  nextAnswer: [{
    text: {
        type: String
    },
    image: {
        type: String
    },
  }],
  price: {
    type: Number,
    require: true
  },
  supplies: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pin', pinSchema);
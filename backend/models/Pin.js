const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  location: [{
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
  }],
  order: {
    type: Number,
    required: true
  },
  task: [{
    prompt: {
        type: String,
    },
    image: {
        type: String
    },
    correctAnswer: {
      type: String
  },
  }],
  directionToPin: [{
    text: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
  }],
  price: {
    type: Number,
  },
  supplies: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pin', pinSchema);
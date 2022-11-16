const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  duration: {
    type: Number
  },
  distance: {
    type: Number
  },
  price: {
    type: Number
  },
  supplies: {
    type: String
  },
  gameStatus: {
    type: Boolean
  },
  date: {
    type: Date
  },
  elevation: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
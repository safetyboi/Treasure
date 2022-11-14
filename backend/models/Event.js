const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
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

module.exports = mongoose.model('Event', eventSchema);
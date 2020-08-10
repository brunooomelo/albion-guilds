const mongoose = require('mongoose')

const eventsSchema = new mongoose.Schema({
  type: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  eventDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

module.exports = mongoose.model('events', eventsSchema)

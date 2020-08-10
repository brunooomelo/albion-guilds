const mongoose = require('mongoose')

const regearSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players'
  },
  killUrl: {
    type: String,
    default: ''
  },
  review: {
    type: Boolean,
    default: false
  },
  isPay: {
    type: Boolean,
    default: false
  },
  messages: [{
    message: {
      type: String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_discords'
    }
  }]
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

module.exports = mongoose.model('regears', regearSchema)

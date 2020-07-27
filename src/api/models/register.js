const mongoose = require('mongoose')

const regSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players'
  },
  review: {
    type: Boolean,
    default: false
  },
  inGuild: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAte: true
  }
});

module.exports = mongoose.model('new_registers', regSchema)
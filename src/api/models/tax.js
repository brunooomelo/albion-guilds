const mongoose = require('mongoose')

const TaxSchema = new mongoose.Schema({
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'guilds'
  },
  value: {
    type: String,
    default: ''
  },
  members: [{
    type: String
  }],
  paid: [{
    type: String
  }],
  noPaid: [{
    type: String
  }],
  token: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'open'
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

module.exports = mongoose.model('event_taxes', TaxSchema)

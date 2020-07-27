const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  fullName: {
    type: String,
    default: ''
  },
  age: {
    type: String,
    default: ''
  },
  discriminator: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
     default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isMaster: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: Boolean,
    default: false
  },
  accounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players'
  }]
})

module.exports = mongoose.model('user_discords', userSchema)
const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
  guildId: {
    type: String,
    default: ''
  },
  guildName: {
    type: String,
    default: ''
  },
  permission: {
    type: Boolean,
    default: false
  },
  environment: {
    prefix: {
      type: String,
      default: ''
    },
    chats: {
      rules: {
        type: String,
        default: ''
      },
      punishments: {
        type: String,
        default: ''
      },
      blacklist: {
        type: String,
        default: ''
      },
      changelog: {
        type: String,
        default: ''
      }
    },
    roles: {
      permission: {
        type: String,
        default: '' 
      },
      dps: {
        type: String,
        default: '' 
      },
      healer: {
        type: String,
        default: '' 
      },
      support: {
        type: String,
        default: '' 
      },
      tank: {
        type: String,
        default: ''
      },
      collector: {
        type: String,
        default: '' 
      },
      apresentou: {
        type: String,
        default: '' 
      },
    },
    webhookId: {
      type: String,
      default: ''
    },
    webhookToken: {
      type: String,
      default: ''
    },
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

module.exports = mongoose.model('guilds', guildSchema)
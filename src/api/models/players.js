const mongoose = require('mongoose')
const { searchFame, searchPlayer } = require('../config/albion')
const webhook = require('../config/webhook')
const Discord = require('../models/user')

const playerScheme = new mongoose.Schema({
  name: {
    type: String,
  },
  albionId: {
    type: String
  },
  totalFame: {
    type: String
  }, 
  objective: {
    type: String,
    default: ''
  },
  lastGuild: {
    type: String,
    default: ''
  },
  weapon: {
    type: String,
    default: ''
  },
  sets: {
    type: String,
    default: ''
  },
  hours: {
    type: String,
    default: ''
  },
  discord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_discords'
  },
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'guilds'
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

playerScheme.pre('save', async function() {
  const player = await searchPlayer(this.name)
  this.totalFame = await searchFame(player.albionId)
  this.name = player.name
  this.albionId = player.albionId
})

playerScheme.post('save', async function() {
  const discord = await Discord.findById(this.discord)
  webhook.send({
    embeds: [{
        "color": 8311585,
        "timestamp": new Date(),
        "footer": {
          "text": "Data de entrada"
        },
        "author": {
          "name": `<@${discord.discordId}>`,
        },
        "fields": [
          {
            "name": "Personagem: ",
            "value": this.name,
            "inline": true
          },
          {
            "name": "TotalFame: ",
            "value": this.totalFame,
            "inline": false
          },
          {
            "name": "Ultima Guild: ",
            "value": this.lastGuild,
            "inline": true
          },
          {
            "name": "Maior Set (specado): ",
            "value": this.sets,
            "inline": true
          },
          {
            "name": "Maior Arma (specado): ",
            "value": this.weapon,
            "inline": true
          }
        ]
    }]
  })
})

module.exports = mongoose.model('players', playerScheme)
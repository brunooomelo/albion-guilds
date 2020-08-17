const mongoose = require('mongoose')
const { searchFame, searchPlayer } = require('../config/albion')
const { WebhookClient } = require('discord.js')
const Discord = require('../models/user')
const Guild = require('../models/guild')
const { cached } = require('../../util/cache')
const { transform } = require('../../util')

const playerScheme = new mongoose.Schema({
  name: {
    type: String
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
  friend: {
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

playerScheme.pre('save', async function () {
  const player = await searchPlayer(this.name)
  this.totalFame = await searchFame(player.albionId)
  this.name = player.name
  this.albionId = player.albionId
})

playerScheme.post('save', async function () {
  const discord = await Discord.findById(this.discord)
  const guilda = await Guild.findById(this.guild)
  const { environment } = await cached.getConfig(guilda.guildId)
  const webhook = new WebhookClient(environment.webhookId, environment.webhookToken)
  webhook.send({
    embeds: [{
      color: 8311585,
      timestamp: new Date(),
      footer: {
        text: 'Data de entrada'
      },
      title: `Registro para a ${guilda.guildName}`,
      fields: [
        {
          name: 'Autor: ',
          value: `:man_detective: <@${discord.discordId}>`,
          inline: true
        },
        {
          name: 'Personagem: ',
          value: `:crossed_swords: ${this.name} :crossed_swords:`,
          inline: true
        },
        {
          name: 'TotalFame: ',
          value: transform(this.totalFame),
          inline: false
        },
        {
          name: 'Ultima Guild: ',
          value: this.lastGuild,
          inline: true
        },
        {
          name: 'Maior Set (specado): ',
          value: this.sets,
          inline: true
        },
        {
          name: 'Maior Arma (specado): ',
          value: this.weapon,
          inline: false
        },
        {
          name: 'Horario Disponivel: ',
          value: this.hours,
          inline: false
        }
      ]
    }]
  })
})

module.exports = mongoose.model('players', playerScheme)

const categories = require('../userCategory')
const { verifyPermission } = require('../util')
const { cached } = require('../util/cache')

module.exports = {
  validate (client, message) {
    if (!verifyPermission(message.member.roles, message.guild.id)) {
      throw new Error('no_permission')
    }
  },
  async run (client, message, args) {
    const { environment } = cached.get(message.guild.id)
    const channel = client.guilds.get(message.guild.id).channels.find((cn) => {
      return (cn.id === args[0])
    })

    if (!channel) {
      throw new Error('no_have_channel')
    }
    const mentions = message.mentions.roles

    const hasRole = (roles, user) => {
      return roles.some((r) => {
        return user.roles.find((UR) => UR.id === r.id)
      })
    }

    const allmembers = client.guilds.get(message.guild.id).members.filter(m => {
      return m.voiceChannelID && !m.user.bot && m.voiceChannelID !== environment.voices.afk && m.voiceChannelID !== channel.id && hasRole(mentions, m)
    })

    await Promise.all(allmembers.map((am) => {
      return am.setVoiceChannel(channel.id)
    }))

    message.channel
      .send('``✅`` Todos movidos para a Sala: ' + channel.name)
  },

  get command () {
    return {
      name: 'move-all',
      category: categories.ADM,
      description: 'Manda mensagem pra todos os usuários',
      usage: 'move-all <MENTION_ROLE>'
    }
  }
}

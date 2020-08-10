const categories = require('../userCategory')
const { verifyPermission } = require('../util')
const { cached } = require('../util/cache')

module.exports = {
  validate (client, message) {
    if (!verifyPermission(message.member.roles, message.guild.id)) {
      throw new Error('no_permission')
    }
  },
  async run (client, message) {
    const { environment } = cached.get(message.guild.id)
    const user = client.guilds.get(message.guild.id).members.get(message.author.id)
    const channel = client.guilds.get(message.guild.id).channels.find((cn) => (cn.id === user.voiceChannelID))

    const mentions = message.mentions.members.first()
    if (!mentions) {
      throw new Error('no_have_channel')
    }
    if (!channel) {
      throw new Error('no_have_channel')
    }
    if (!user) {
      throw new Error('no_have_channel')
    }

    const allmembers = client.guilds.get(message.guild.id).members.filter(m => {
      return m.voiceChannelID && !m.user.bot && m.voiceChannelID !== environment.voices.afk && m.voiceChannelID !== channel.id && m.id === mentions.id
    })

    await Promise.all(allmembers.map((am) => {
      return am.setVoiceChannel(channel.id)
    }))

    message.channel
      .send('``✅`` ' + mentions.nickname || mentions.user.username + ' movido para a sala ' + channel.name)
      .then((mn) => mn.delete(8000))
  },

  get command () {
    return {
      name: 'move',
      category: categories.ADM,
      description: 'Manda mensagem pra todos os usuários',
      usage: 'move <MENTIONS>'
    }
  }
}

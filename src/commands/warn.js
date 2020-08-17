const Discord = require('discord.js')
const categories = require('../userCategory')
const { verifyPermission, getYear } = require('../util')
const { cached } = require('../util/cache')

module.exports = {
  validate (client, message, args) {
    if (!verifyPermission(message.member.roles, message.guild.id)) {
      throw new Error('no_permission')
    }
    const member = message.mentions.members.first()
    if (!member || args.length < 2) {
      throw new Error('invalid_syntax')
    }
  },
  async run (client, message, args) {
    const { environment } = await cached.getConfig(message.guild.id)
    const member = message.mentions.members.first()
    const reason = args.slice(1).join(' ')

    const embedPunish = new Discord.RichEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Usuário punido:**', member.user, true)
      .addField('``👮`` **Punido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'WARN', true)
      .addField('``📣`` **Motivo:**', reason, true)
      .setThumbnail(member.user.avatarURL)
      .setColor('#8146DC')
      .setFooter(
        getYear() + `© ${message.guild.name}`
      )
      .setTimestamp()

    message.channel
      .send('``✅`` Usuário punido com sucesso.')
      .then(msg => msg.delete(8000))

    member.send('Você foi punido, mais informações abaixo.', embedPunish)
    client.channels.get(environment.chats.punishments).send(embedPunish)
  },

  get command () {
    return {
      name: 'warn',
      category: categories.MOD,
      description: 'Tomou warn com descricao bonita.',
      usage: 'warn'
    }
  }
}

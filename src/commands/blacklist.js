const Discord = require('discord.js')
const categories = require('../userCategory')
const util = require('../util')
const { cached } = require('../util/cache')

module.exports = {
  validate (client, message, args) {
    if (!util.verifyPermission(message.member.roles, message.guild.id)) {
      throw new Error('no_permission')
    }
    if (args.length < 2) {
      throw new Error('invalid_syntax')
    }
  },
  async run (client, message, args) {
    const member = message.mentions.users.first() || args[0]
    const reason = args.slice(1).join(' ')

    const embedPunish = new Discord.RichEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Player:**', member, true)
      .addField('``👮`` **Punido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'BlackList', true)
      .addField('``📣`` **Motivo:**', reason, true)
      .setThumbnail()
      .setColor('#8146DC')
      .setFooter(
        util.getYear() + `© ${message.guild.name}`
      )
      .setTimestamp()

    message.channel
      .send('``✅`` Player adicionado na BlackList')
      .then(msg => msg.delete(8000))
    const { environment } = await cached.getConfig(message.guild.id)

    client.channels.get(environment.chats.blacklist).send(embedPunish)
    member.send('Você foi punido, mais informações abaixo.', embedPunish).catch((error) => {
      console.log('Este ')
      return error
    })
  },

  get command () {
    return {
      name: 'blacklist',
      category: categories.MOD,
      description: 'Irá mostrar o avatar de um usuario.',
      usage: 'blacklist'
    }
  }
}

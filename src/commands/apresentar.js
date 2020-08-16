const Discord = require('discord.js')
const categories = require('../userCategory')
const { cached, register } = require('../util/cache')

module.exports = {
  validate (client, message) {
    const presentedRole = client.guilds
      .get(message.guild.id)
      .roles
      .get(cached.get(message.guild.id).environment.roles.apresentou)
    if (message.channel.type === 'dm') {
      throw new Error('direct')
    }
    if (message.member.roles.has(presentedRole.id)) {
      throw new Error('registered')
    }
  },
  run (client, message) {
    register.set(message.author.id, message.guild.id)
    message.channel
      .send('``❕`` Todas as informações foram enviadas em seu privado.')
      .then(msg => msg.delete(8000))
    return message.author.send(
      '``❗`` Este é o nosso sistema de registro.\n\nResponda as perguntas com sinceridade total por sua pessoa.\nPara cancelar o envio, apenas ignore.\n\n``❗`` Para continuar digite ``!REGISTRAR`` aqui neste chat.'
    )
  },
  async fail (err, client, message) {
    if (err.message === 'direct') {
      const directEmbed = new Discord.RichEmbed()
        .setTitle(
          '``❌`` **Você não pode utilizar este comando aqui.**'
        )
        .setColor('#36393E')
      return message.channel.send(directEmbed)
    }
    if (err.message === 'registered') {
      return message.channel
        .send('``❌`` Você já se apresentou.')
        .then(msg => msg.delete(8000))
    }
    return null
  },

  get command () {
    return {
      name: 'apresentar',
      category: categories.USER,
      description: 'O usuario irá se apresentar.',
      usage: 'apresentar'
    }
  }
}

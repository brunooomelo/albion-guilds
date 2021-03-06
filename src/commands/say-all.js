const categories = require('../userCategory')
const { verifyPermission } = require('../util')

module.exports = {
  validate (client, message) {
    if (!verifyPermission(message.member.roles, message.guild.id)) {
      throw new Error('no_permission')
    }
    if (!message.mentions.roles.first()) {
      throw new Error('no_mentions')
    }
  },
  async run (client, message, args) {
    try {
      const msg = args.slice(1).join(' ')
      const role = message.mentions.roles.first()

      if (!msg) {
        return message
          .reply(':x: Voce deve informar uma mensagem')
          .then(msgn => msgn.delete(5000))
          .catch(err => console.log(err))
      }

      client.guilds.get(message.guild.id).members.forEach(member => {
        if (member.roles.has(role.id)) {
          if (!member.user.bot) {
            member.send(msg)
          }
        }
      })

      message.channel.send(
        'Enviando mensagem para todos os usuários...\n'
      ).then((msg) => msg.delete(8000))
    } catch (error) {
      console.log('deu erro', error)
    }
  },

  get command () {
    return {
      name: 'say-all',
      category: categories.ADM,
      description: 'Manda mensagem pra todos os usuários',
      usage: 'say-all <role> <msg>'
    }
  }
}

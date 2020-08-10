const categories = require('../userCategory')
const { verifyPermission } = require('../util')

module.exports = {
  validate (client, message) {
    if (!verifyPermission(message.member.roles, message.guild.id)) {
      throw new Error('no_permission')
    }
  },
  async run (client, message, args) {
    const msg = args.slice(0).join(' ')

    if (!msg) {
      return message
        .reply(':x: Voce deve informar uma mensagem')
        .then(msgn => msgn.delete(5000))
        .catch(err => console.log(err))
    }

    message.channel.send(`${msg}`)
  },

  get command () {
    return {
      name: 'say',
      category: categories.MOD,
      description: 'Faz o bot falar algo',
      usage: 'say <msg>'
    }
  }
}

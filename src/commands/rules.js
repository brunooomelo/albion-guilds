const categories = require('../userCategory')

const rules = require('../rules.json')

module.exports = {
  validate (client, message) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      throw new Error('no_permission')
    }
  },
  async run (client, message) {
    // mandar em um channels especifico?sim

    message.channel
      .fetchMessages({ limit: 100 })
      .then(messages => message.channel.bulkDelete(messages))

    let timer = 2000
    rules.map((r, index) => {
      if (index === 0) {
        client.channels
          .get(process.env.RULES_CHAT)
          .send(r.message)
        return
      }
      setTimeout(() => {
        client.channels
          .get(process.env.RULES_CHAT)
          .send(r.message)
      }, timer)
      timer += 100
    })
  },

  get command () {
    return {
      name: 'rules',
      category: categories.ADM,
      description: 'Irá enviar as regras',
      usage: 'rules'
    }
  }
}

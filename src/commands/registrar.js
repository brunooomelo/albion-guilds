const { promisify } = require('util')
const Discord = require('discord.js')
const util = require('../util')
const roles = require('../../assets/roles.js')
const categories = require('../userCategory')
const langPTBR = require('../../assets/pt_BR')
const createPlayer = require('../api/services/createPlayer')
const { cached, register } = require('../util/cache')

const TIMEOUT = 60 * 1000

// const RolesEng = roles.eng_roles.map(en => en.id)

// const englishDescription = roles.eng_roles
//   .map(engRole => `${engRole.react}  -  ${engRole.name}`)
//   .join('\n')

const categoryDescriptionLines = (guild) => roles(guild).categories_roles
  .map(devRole => `${devRole.react}  -  ${devRole.name}`)
  .join('\n')

const categoryDescription = (guild) => `${categoryDescriptionLines(guild)}\n\n\n✅ - Pronto.`

const isAuthor = (message, author) => message.author.id === author.id
const collect = promisify((collector, cb) => {
  collector.on('end', (collected, reason) => {
    const collectedArray = collected.array()
    if (collectedArray.length) {
      cb(null, collectedArray)
    } else {
      cb(new Error(reason))
    }
  })
})
const collectMessage = message => {
  const collector = message.author.dmChannel.createMessageCollector(
    ({ author }) => isAuthor(message, author),
    { time: TIMEOUT }
  )
  collector.on('collect', msg => {
    if (!util.isCommand(msg)) {
      collector.stop()
    }
  })
  return collect(collector).then(() => collector)
}

const sendCategoryMessage = async (author, guild) => {
  const message = await author.send(`${langPTBR.continuar.funcao.title}\n\n${categoryDescription(guild)}`)
  await message.react('1⃣')
  await message.react('2⃣')
  await message.react('3⃣')
  await message.react('4⃣')
  await message.react('5⃣')
  await message.react('✅')
  return message
}
const collectCategoryReactions = async ({
  author,
  message,
  client,
  categoriesRoles
}) => {
  const guild = cached.get(register.get(author.id))
  const collector = message.createReactionCollector(
    (reaction, user) => isAuthor({ author }, user),
    { time: TIMEOUT }
  )
  collector.on('collect', async (reaction, reactionCollector) => {
    if (reaction.emoji.name === '✅') {
      await Promise.all(reactionCollector.collected.map(async (r) => {
        const emoji = r.emoji.name
        const selectedRole = categoriesRoles.find(role => role.emoji === emoji)
        if (!selectedRole) {
          return
        }

        return client.guilds
          .get(guild.guildId)
          .members.get(author.id)
          .addRole(selectedRole.id)
          .then(() => author.send('``✅`` TAG ' + `**${selectedRole.name}**` + ' adicionada com sucesso!'))
      }))
      author.send('``✅`` todas as tags adicionadas com sucesso!')
      collector.stop()
    }
  })
  return collect(collector).then(() => collector)
}

const cooldown = {}
module.exports = {
  validate: async (client, message) => {
    if (!register.has(message.author.id)) {
      throw new Error('start_register')
    }
  },
  run: async (client, message) => {
    const guild = cached.get(register.get(message.author.id))
    if (cooldown[message.author.id]) {
      throw new Error('cooldown')
    }
    cooldown[message.author.id] = true
    const categoriesRoles = roles(guild.environment).categories_roles
    const collectors = {}

    const presentedRole = client.guilds
      .get(guild.guildId)
      .roles.get(guild.environment.roles.apresentou)

    if (
      client.guilds
        .get(guild.guildId)
        .members.get(message.author.id)
        .roles.some(role => role.name === presentedRole.name)
    ) {
      throw new Error('registered')
    }

    await message.author.send(langPTBR.continuar.name.title)
    collectors.name = await collectMessage(message)

    await message.author.send(langPTBR.continuar.nick.title)
    collectors.nick = await collectMessage(message)

    await message.author.send(langPTBR.continuar.age.title)
    collectors.age = await collectMessage(message)

    await message.author.send(langPTBR.continuar.objective.title)
    collectors.objective = await collectMessage(message)

    await message.author.send(langPTBR.continuar.guild.title)
    collectors.guild = await collectMessage(message)

    await message.author.send(langPTBR.continuar.weapon.title)
    collectors.weapon = await collectMessage(message)

    await message.author.send(langPTBR.continuar.set.title)
    collectors.set = await collectMessage(message)

    const categoryMessage = await sendCategoryMessage(message.author, guild.environment)
    await collectCategoryReactions({
      client,
      author: message.author,
      message: categoryMessage,
      categoriesRoles
    })

    await message.author.send(langPTBR.continuar.friend.title)
    collectors.friend = await collectMessage(message)

    await message.author.send(langPTBR.continuar.horario.title)
    collectors.horario = await collectMessage(message)

    createPlayer({
      discord: {
        id: message.author.id,
        discriminator: message.author.discriminator,
        username: message.author.username,
        guild: message.guild.id
      },
      name: collectors.name.collected.first().content,
      nick: collectors.nick.collected.first().content,
      age: collectors.age.collected.first().content,
      objective: collectors.objective.collected.first().content,
      guild: collectors.guild.collected.first().content,
      weapon: collectors.weapon.collected.first().content,
      sets: collectors.set.collected.first().content,
      horario: collectors.horario.collected.first().content,
      friend: collectors.friend.collected.first().content
    }).catch((err) => console.log(err))
    console.log(`[#LOG] create player :: ${message.author.id} in ${guild.guildName}`)

    register.delete(message.author.id)
    await client.guilds
      .get(guild.guildId)
      .members
      .get(message.author.id)
      .addRole(guild.environment.roles.apresentou)
  },
  async fail (err, client, message) {
    if (err.message === 'cooldown') {
      const cooldownEmbed = new Discord.RichEmbed()
        .setTitle(
          '``❌`` **Você já utilizou este comando, verifique sua DM para mais informações.**'
        )
        .setColor('#36393E')
      return message.channel.send(cooldownEmbed)
    }
    cooldown[message.author.id] = false

    // geralmente quando user ta com dm desativada
    if (err.message === 'Cannot send messages to this user') {
      const dmDisabled = new Discord.RichEmbed()
        .setTitle(
          '``❌`` **Ops, seu privado está desativado e não consigo enviar algumas informações.**'
        )
        .setColor('#36393E')
      return message.channel.send(dmDisabled)
    }
    if (err.message === 'registered') {
      return message.channel
        .send('``❌`` Você já se apresentou.')
        .then(msg => msg.delete(8000))
    }
    if (err.message === 'start_register') {
      const timeout = new Discord.RichEmbed()
        .setTitle('``❌`` Você precisa usar o !apresentar')
        .setDescription(
          'Utilize `!apresentar` no `chat de comando` para começar sua apresentação'
        )
        .setColor('#36393E')
      return message.author.send(timeout)
    }
    if (err.message === 'time') {
      const timeout = new Discord.RichEmbed()
        .setTitle('``❌`` **Tempo limite de resposta excedido.**')
        .setDescription(
          'Utilize `!registrar` para recomeçar sua apresentação.'
        )
        .setColor('#36393E')
      return message.author.send(timeout)
    }
    return null
  },
  async success (client, message, args) {
    cooldown[message.author.id] = false
    const success = new Discord.RichEmbed({
      title: '``✅`` **Apresentação finalizada com sucesso.**',
      color: 0x36393e
    })
    await message.author.send(success)
  },
  get command () {
    return {
      name: 'registrar',
      category: categories.USER,
      description: 'O usuario irá continuar a apresentação.',
      usage: 'registrar'
    }
  }
}

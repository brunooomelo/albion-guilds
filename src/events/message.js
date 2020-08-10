const util = require('../util')
const { cached } = require('../util/cache')

const runCommand = async (client, message) => {
  if (message.channel.type !== 'dm') {
    const { environment } = cached.get(message.guild.id)
    if (
      message.channel.id === environment.chats.feedbacks
    ) {
      await message.react('✅')
      await message.react('❌')
    }
  }

  if (!util.isCommand(message)) return

  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command)

  if (message.channel.type === 'dm' && command !== 'registrar') {
    message.delete().catch(() => {})
    return message.channel.send('``❌`` Use comandos no canal de comandos').then(msg => msg.delete(15000))
  }

  if (!cmd) return

  message.delete().catch(() => {})

  if (message.channel.type === 'dm') {
    console.log(
      '[#LOG]', `PRIVATE MESSAGE :: ${message.author.username} (${message.author.id}) executou o comando: ${cmd.command.name}`
    )
  } else {
    console.log(
      '[#LOG]', `${message.guild.name} (${message.guild.id}):: ${message.author.username} (${message.author.id}) executou o comando: ${cmd.command.name}`
    )
  }

  try {
    if (cmd.validate) {
      await cmd.validate(client, message, args)
    }
    await cmd.run(client, message, args)
    if (cmd.success) {
      await cmd.success(client, message, args)
    }
  } catch (err) {
    if (cmd.fail) {
      await cmd.fail(err, client, message, args)
      return
    }
    const embed = util.translate(`${command}.fail.${err.message}`) || util.translate(`${command}.fail.default`) || util.translate('error_command', [command, err.message])
    if (!embed.title) {
      embed.setTitle(
        `\`\`❌\`\` » ${process.env.PREFIX}${command}`
      )
    }
    if (!embed.color) {
      embed.setColor('#36393E')
    }
    await message.reply(embed).then(msg => msg.delete(15000))
    return
  } finally {
    if (cmd.after) {
      await cmd.after(client, message, args)
    }
  }
}

module.exports = async (client, message) => {
  if (message.author.bot) return

  if (message.content.toLowerCase() === 'boa noite') {
    message.react('💤')
  }
  if (message.content.toLowerCase() === 'bom dia') {
    message.react('🌅')
  }
  if (message.content.toLowerCase() === 'boa tarde') {
    message.react('🌞')
  }

  await Promise.all([
    runCommand(client, message)
  ])
}

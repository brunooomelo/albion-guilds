const GuildDiscord = require('../models/guild')

module.exports = async (id, name) => {
  const guild = await GuildDiscord.findOne({ guildId: id })
  if (!guild) {
    return GuildDiscord.create({ 
      guildId: id,
      guildName: name
    })
  }

  guild.name = name
  await guild.save()
  return guild
}
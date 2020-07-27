const UserDiscord = require('../models/user')
const Player = require('../models/players')

const createPlayer = async (payload) => {
  const discordId = await UserDiscord.findOne({ discordId: payload.discord.id })
  const player = await Player.findOne({ name: { $regex: payload.nick, $options: 'i' } })
  let _discordId = null
  if (!discordId) {
    _discordId = await UserDiscord.create({
      discordId: payload.discord.id,
      discriminator: payload.discord.discriminator,
      age: payload.age,
      fullName: payload.name
    })
  } else {
    discordId.discriminator= payload.discord.discriminator,
    discordId.age= payload.age,
    discordId.fullName= payload.name
    discordId.username = payload.discord.username
    await discordId.save()
  }

  if (player) {
    player.name = payload.nick
    player.objective = payload.objective
    player.lastGuild = payload.guild
    player.weapon = payload.weapon
    player.sets = payload.sets
    player.hours = payload.horario
    player.discord = _discordId ? _discordId._id: discordId._id
    await player.save()
  } else {
    await Player.create({
      name: payload.nick,
      objective: payload.objective,
      lastGuild: payload.guild,
      weapon: payload.weapon,
      sets: payload.sets,
      hours: payload.horario,
      discord: _discordId ? _discordId._id: discordId._id
    })
  }
}



module.exports = createPlayer
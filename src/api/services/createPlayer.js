/* eslint-disable no-unused-expressions */
const UserDiscord = require('../models/user')
const Player = require('../models/players')
const Guild = require('../models/guild')

const createPlayer = async (payload) => {
  try {
    const discordId = await UserDiscord.findOne({ discordId: payload.discord.id })
    const guild = await Guild.findOne({ guildId: payload.discord.guild })
    const player = await Player.findOne({ name: { $regex: payload.nick, $options: 'i' }, guild: guild._id })
    const hasGuild = guild ? guild._id : ''
    let _discordId = null
    if (!discordId) {
      _discordId = await UserDiscord.create({
        discordId: payload.discord.id,
        discriminator: payload.discord.discriminator,
        age: payload.age,
        fullName: payload.name,
        guild: hasGuild
      })
    } else {
      discordId.discriminator = payload.discord.discriminator
      discordId.age = payload.age
      discordId.fullName = payload.name
      discordId.username = payload.discord.username
      discordId.guild = hasGuild
      await discordId.save()
    }

    if (player) {
      player.name = payload.nick
      player.objective = payload.objective
      player.lastGuild = payload.guild
      player.weapon = payload.weapon
      player.sets = payload.sets
      player.hours = payload.horario
      player.friend = payload.friend
      player.discord = _discordId ? _discordId._id : discordId._id
      player.guild = hasGuild
      await player.save()
    } else {
      await Player.create({
        friend: payload.friend,
        name: payload.nick,
        objective: payload.objective,
        lastGuild: payload.guild,
        weapon: payload.weapon,
        sets: payload.sets,
        hours: payload.horario,
        discord: _discordId ? _discordId._id : discordId._id,
        guild: hasGuild
      })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = createPlayer

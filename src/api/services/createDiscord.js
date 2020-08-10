const Discord = require('../models/user')

module.exports = async (data) => {
  const payload = {
    discordId: data.id,
    email: data.email,
    verified: data.verified,
    username: data.username
  }

  const userDiscord = await Discord.findOne({ discordId: data.discordId }).lean()

  if (!userDiscord) {
    await Discord.create(payload)
    return
  }

  await Discord.updateOne({ discordId: data.discordId }, {
    $set: payload
  })
}

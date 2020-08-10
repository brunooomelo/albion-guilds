const cache = new Map()
const guildModel = require('../api/models/guild')

module.exports = {
  cached: cache,
  set: async (guildId) => {
    if (!cache.get(guildId)) {
      const gd = await guildModel.findOne({ guildId })
      cache.set(gd.guildId, guildId)
    }
  },
  initialize: async () => {
    const guilds = await guildModel.find({ permission: true }).lean()
    await Promise.all(guilds.map(gd => cache.set(gd.guildId, gd)))
  }
}

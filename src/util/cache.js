const cache = new Map()
const guildModel = require('../api/models/guild')
const register = new Map()

module.exports = {
  cached: cache,
  register,
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

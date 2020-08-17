const Redis = require('ioredis')
const guildModel = require('../api/models/guild')
const register = new Map()

class Cache {
  constructor () {
    this.status = false
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      keyPrefix: 'cache:',
      retryStrategy (times) {
        const delay = Math.min(times * 1000, 10000)
        return delay
      }
    })

    this.redis.on('ready', () => {
      console.log('[#LOG] :: REDIS READY')
      this.status = true
    })
    this.redis.on('error', () => {
      this.status = false
    })
    this.redis.on('close', () => {
      this.status = false
    })
    this.redis.on('reconnecting', () => {
      console.log('[#LOG] :: REDIS RECONNECTING')
      this.status = false
    })
    this.redis.on('end', () => {
      console.log('[#LOG] :: REDIS END')
      this.status = false
    })
  }

  async get (key) {
    if (!this.status) {
      return null
    }
    const value = await this.redis.get(key)
    return value ? JSON.parse(value) : null
  }

  async set (key, value, timeExp = 60 * 15) {
    return this.redis.set(key, JSON.stringify(value), 'EX', timeExp)
  }

  async setConfig (key, value) {
    return this.redis.set(`config:${key}`, JSON.stringify(value))
  }

  async getConfig (key) {
    if (!this.status) {
      return null
    }
    const value = await this.redis.get(`config:${key}`)
    return value ? JSON.parse(value) : null
  }
}

const cached = new Cache()

module.exports = {
  cached,
  register,
  set: async (guildId) => {
    if (!await cached.getConfig(guildId)) {
      const gd = await guildModel.findOne({ guildId })
      cached.set(gd.guildId, guildId)
    }
  },
  initialize: async () => {
    const guilds = await guildModel.find({ permission: true }).lean()
    await Promise.all(guilds.map(gd => cached.setConfig(gd.guildId, gd)))
  }
}

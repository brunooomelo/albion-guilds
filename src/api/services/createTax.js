const crypto = require('crypto')
const Tax = require('../models/tax')
const { searchMembers } = require('../config/albion')

module.exports = async ({ _id, permission, environment }) => {
  if (!permission) {
    return null
  }
  const tax = await Tax.findOne({ guild: _id, status: 'open' }).limit(1)
  if (tax) {
    const token = await generateToken()
    tax.token = token
    tax.status = 'closed'

    await tax.save()
  }
  const members = (await searchMembers(environment.guildAlbionId)).map(m => m.name)
  await Tax.create({
    guild: _id,
    status: 'open',
    members,
    value: environment.taxValue
  })
}

async function generateToken () {
  const token = crypto.randomBytes(5).toString('hex')
  const has = await Tax.findOne({ token }).limit(1)
  if (has) {
    return generateToken()
  }
  return token
}

/**
 * open - waiting pay
 * closed - close pay
 * finished - checked pay
 */

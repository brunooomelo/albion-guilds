// const { searchMembers } = require('../api/config/albion')
const database = require('../api/config/database')
const { initialize, cached } = require('../util/cache')
const { isSunday } = require('date-fns')
const createTax = require('../api/services/createTax')
require('dotenv').config()

async function init (conn) {
  const allConfigs = (await cached.getConfig('*')).slice(0, 1)
  await Promise.all(allConfigs.map(createTax))
    .then(() => console.log('[#LOG] Job createad'))
  return conn
}

if (isSunday(new Date())) {
  database()
    .then(initialize)
    .then(init)
    .then((conn) => conn.connection.close())
    .then(() => process.exit(0))
    .catch((error) => console.log('[#LOG] database connection :: ERROR', error.message))
}

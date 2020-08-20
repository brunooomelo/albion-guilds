// const { searchMembers } = require('../api/config/albion')
const database = require('../api/config/database')
const { initialize, cached } = require('../util/cache')
const { getWeek, isSunday, isThursday } = require('date-fns')
require('dotenv').config()

async function init () {
  console.log('init')
  const allConfigs = await cached.getConfig('*')

  console.log(new Date())
  console.log(isSunday(new Date()))
  console.log(allConfigs)
}

database()
  .then(() => console.log('[#LOG] database connection :: SUCCESS'))
  .then(initialize)
  .then(init)
  .catch((error) => console.log('[#LOG] database connection :: ERROR', error.message))

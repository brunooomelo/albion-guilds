const axios = require('axios')

const api = axios.create({
  baseURL: 'http://gameinfo.albiononline.com/api/gameinfo'
})

function tranform (labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e+9
  ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
  : Math.abs(Number(labelValue)) >= 1.0e+6
  ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
  : Math.abs(Number(labelValue)) >= 1.0e+3
  ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
  : Math.abs(Number(labelValue));
}

const searchFame = async (playerID) => {
  const { data } = await api.get(`/players/${playerID}`)
  return data.KillFame + data.LifetimeStatistics.PvE.Total + data.LifetimeStatistics.Gathering.All.Total + data.LifetimeStatistics.Crafting.Total
}

const searchPlayer = async (playerName) => {
  const { data } = await api.get(`/search?q=${playerName}`)
  const hasPlayer = data.players.find((player) =>{
    return player.Name.toUpperCase() === playerName.toUpperCase()
  })
  if (!hasPlayer) {
    throw new Error('Player not found')
  }
  return {
    albionId: hasPlayer.Id,
    name: hasPlayer.Name
  }
}

module.exports = {
  searchFame,
  searchPlayer
}


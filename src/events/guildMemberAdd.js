const createDiscord = require('../api/services/createDiscord')
const { cached } = require('../util/cache')

module.exports = async (client, member) => {
  const { environment } = cached.get(member.guild.id)
  try {
    member.send(environment.welcomeMessage)
    await createDiscord(member.user)
    console.log(`[#LOG] usuario entrou no servidor: ${member.user.username}`)
  } catch (error) {
    console.log(error.message)
    return error
  }
}

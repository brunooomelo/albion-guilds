const createDiscord = require('../api/services/createDiscord')
const { cached } = require('../util/cache')

module.exports = async (client, member) => {
  const { environment } = await cached.getConfig(member.guild.id)
  try {
    member.send(environment.welcomeMessage)
    await createDiscord(member.user)
    console.log(`[#LOG] usuario : ${member.user.username} entrou no servidor ${member.guild.name}`)
  } catch (error) {
    console.log(error.message)
    return error
  }
}

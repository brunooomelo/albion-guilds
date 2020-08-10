const createGuild = require('../api/services/createGuild')

module.exports = async (client, guild) => {
  console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) adicinou o bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`)
  const { permission } = await createGuild(guild.id, guild.name)

  if (!permission) {
    await guild.owner
      .send('Você precisa de permissão para executar esse bot, fale com o Administrador do bot.')
      .then(() => guild.leave())
  }
}

const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client, message) {
		const user = client.guilds.get(process.env.GUILD_ID).members.get(message.author.id)
		const channel = client.guilds.get(process.env.GUILD_ID).channels.find((cn) => {
			return (cn.id === user.voiceChannelID)
		})

		const mentions = message.mentions.members.first()
		if (!mentions)  {
			throw new Error('no_have_channel')
		}
		if (!channel) {
			throw new Error('no_have_channel')
		}
		if (!user) {
			throw new Error('no_have_channel')
		}

		const allmembers = client.guilds.get(process.env.GUILD_ID).members.filter(m => {
			return m.voiceChannelID && !m.user.bot && m.voiceChannelID !== process.env.AFK && m.voiceChannelID !== channel.id && m.id === mentions.id
		})

		await Promise.all(allmembers.map((am) => {
			return am.setVoiceChannel(channel.id)
		}))


		message.channel
			.send('``✅`` '+ mentions.nickname + ' movido para a sala '+ channel.name)
			.then((mn) => mn.delete(8000))
	},

	get command() {
		return {
			name: 'move',
			category: categories.ADM,
			description: 'Manda mensagem pra todos os usuários',
			usage: 'move <MENTIONS>',
		};
	},
};
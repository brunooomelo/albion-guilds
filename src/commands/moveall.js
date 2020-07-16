const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client, message, args) {
		const channel = client.guilds.get(process.env.GUILD_ID).channels.find((cn) => {
			return (cn.id === args[0])
		})

		if (!channel) {
			throw new Error('no_have_channel')
		}
		const mentions = message.mentions.roles

		const hasRole = (roles, user) => {
			return roles.some((r) => {
				return user.roles.find((UR) => UR.id === r.id )
			})
		}

		const allmembers = client.guilds.get(process.env.GUILD_ID).members.filter(m => {
			return m.voiceChannelID && !m.user.bot && m.voiceChannelID !== process.env.AFK && m.voiceChannelID !== channel.id && hasRole(mentions, m)
		})

		await Promise.all(allmembers.map((am) => {
			return am.setVoiceChannel(channel.id)
		}))

		message.channel
			.send('``✅`` Todos movidos para a Sala: '+ channel.name)
	},

	get command() {
		return {
			name: 'move-all',
			category: categories.ADM,
			description: 'Manda mensagem pra todos os usuários',
			usage: 'move-all <CHANNEL> ...<MENTIONS>',
		};
	},
};
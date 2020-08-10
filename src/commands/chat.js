const categories = require('../userCategory');
const { verifyPermission } = require('../util')
const { cached } = require('../util/cache') 

module.exports = {
	async validate(client, message, [state]) {
		if (!verifyPermission(message.member.roles, message.guild.id)) {
			throw new Error('no_permission');
		}
		if (!state) {
			throw new Error('no_state');
		}
	},
	async run(client, message, [state]) {
		const { environment } = cached.get(message.guild.id)
		const SEND_MESSAGES = state === 'on';
		await message.channel.overwritePermissions(
			client.guilds
				.get(message.guild.id)
				.roles.find('id', environment.roles.main),
			{ SEND_MESSAGES }
		);
		if (SEND_MESSAGES) {
			await message.channel.send('``❗`` Este canal foi aberto.');
			await message.channel
				.send('``✅`` Canal aberto com sucesso.')
				.then(msg => msg.delete(8000));
		} else {
			await message.channel.send('``❗`` Este canal foi pausado.');
			await message.channel
				.send('``✅`` Canal pausado com sucesso.')
				.then(msg => msg.delete(8000));
		}
	},
	get command() {
		return {
			name: 'chat',
			category: categories.MOD,
			description: 'Usuário irá ativar/desativar o chat.',
			usage: 'chat',
		};
	},
};
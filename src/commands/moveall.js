const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client, message, args) {

		
	},

	get command() {
		return {
			name: 'move-all',
			category: categories.ADM,
			description: 'Manda mensagem pra todos os usuários',
			usage: 'move-all',
		};
	},
};
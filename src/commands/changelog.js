const Discord = require('discord.js');
const moment = require('moment');
const categories = require('../userCategory');

module.exports = {
	async run(client, message, args) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			return message.reply(
				'Você não tem permissão para usar esse comando'
			);
		}

    const data = `${moment().format('L')}`;
    const hora = `${moment().format('HH:MM')}`;
		const texto = args.slice(0).join(' ');
		const logs = new Discord.RichEmbed()
			.addField(`:white_small_square: **${data}** **${hora}**`, `${texto}`)
			.setColor('#ffffff');
		return client.channels.get('733281602632679524').send(logs);
	},

	get command() {
		return {
			name: 'changelog',
			category: categories.MOD,
			description: 'Todos os tipos de mudanca',
			usage: 'changelog <text>',
		};
	},
};
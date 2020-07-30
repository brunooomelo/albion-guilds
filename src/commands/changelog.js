const Discord = require('discord.js');
const moment = require('moment-timezone')
const categories = require('../userCategory');

moment.tz('America/Sao_Paulo')

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
		return client.channels.get(process.env.CHANGELOG_CHAT).send(logs);
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
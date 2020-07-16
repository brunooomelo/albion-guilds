const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	run: (client, message, args) => {
		// TODO: verificar o que fazer com possivel erro

		const mensg = args.slice(1).join(' ');
		const mention = args[0]
		if (!mention) {
			throw new Error('invalid_syntax');
		}

		if (!mensg) return null;

		const announce = new Discord.RichEmbed()
			.setTitle('``🔔`` **PvP School informa:**')
			.setDescription(mensg)
			.setColor('#8146DC')
			.setFooter(
				util.getYear() + ' © PvP School',
				''
			)
			.setTimestamp();

		return message.channel.send(mention, announce);
	},

	get command() {
		return {
			name: 'anunciar',
			category: categories.MOD,
			description: 'O usuario irá anunciar.',
			usage: 'anunciar <TAG> <mensagem>',
		};
	},
};
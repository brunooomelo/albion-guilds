const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	validate(client, message) {
		if (!message.member.roles.exists('id', '733278948888412222')) {
			throw new Error('no_permission');
		}
	},
	run(client, message, args) {
		// TODO: verificar o que fazer com possivel erro

		const mensg = args.slice(2).join(' ');
		const imageUrl = args[0];
		const mention = args[1]
		
		if (!mensg) return null;
		if (!imageUrl) return null;

		const announceImage = new Discord.RichEmbed()
			.setTitle('``🔔`` **PvP School informa:**')
			.setDescription(mensg)
			.setImage(imageUrl)
			.setColor('#8146DC')
			.setFooter(
				`${util.getYear()} © PvP School`
			)
			.setTimestamp();

		return message.channel.send(mention, announceImage);
	},

	get command() {
		return {
			name: 'anunciar-img',
			category: categories.MOD,
			description: 'O usuario irá anunciar com imagem.',
			usage: 'anunciar-img <url_image> <Mentions> <texto>',
		};
	},
};
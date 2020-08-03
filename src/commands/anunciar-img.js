const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	validate(client, message) {
		if (!util.verifyPermission(message.member.roles, message.guild.id)) {
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
			.setTitle('``🔔`` **'+ message.guild.name +' informa:**')
			.setDescription(mensg)
			.setImage(imageUrl)
			.setColor('#8146DC')
			.setFooter(
				`${util.getYear()} © ${message.guild.name}`
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
const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	validate(client, message, args) {
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			throw new Error('no_permission');
		}
		const member = message.mentions.members.first();
		if (!member || args.length < 2) {
			throw new Error('invalid_syntax');
		}
	},
	async run(client, message, args) {
		const member = args[0];
		const reason = args.slice(1).join(' ');

		const embedPunish = new Discord.RichEmbed()
			.setTitle('``🚔`` » Punição')
			.addField('``👤`` **Player:**', member, true)
			.addField('``👮`` **Punido por:**', message.author, true)
			.addField('``📄`` **Tipo:**', 'BlackList', true)
			.addField('``📣`` **Motivo:**', reason, true)
			.setThumbnail()
			.setColor('#8146DC')
			.setFooter(
				util.getYear() + ' © PvP School - ' + message.author.username,
			)
			.setTimestamp();
			
		message.channel
			.send('``✅`` Player adicionado na BlackList')
			.then(msg => msg.delete(8000));

		// member.send('Você foi punido, mais informações abaixo.', embedPunish);
		client.channels.get(process.env.BLACKLIST_CHAT).send(embedPunish);

		// await member.ban(
		// 	`Motivo: ${reason} | Punido por: ${message.author.tag}`
		// );
	},

	get command() {
		return {
			name: 'blacklist',
			category: categories.MOD,
			description: 'Irá mostrar o avatar de um usuario.',
			usage: 'blacklist',
		};
	},
};
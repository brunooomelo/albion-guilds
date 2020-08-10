const Discord = require('discord.js');
const categories = require('../userCategory');
const { format } = require('date-fns');
const { verifyPermission } = require('../util');
const { cached } = require('../util/cache') 

module.exports = {
	async run(client, message, args) {
		const { environment } = cached.get(message.guild.id)
		if (!verifyPermission(message.member.roles, message.guild.id)) {
			return message.reply(
				'Você não tem permissão para usar esse comando'
			);
		}
		const ts = new Date()
		const texto = args.slice(0).join(' ');
		const logs = new Discord.RichEmbed()
			.addField(`:white_small_square: **${format(ts, 'dd/MM/yyyy', { timeZone: 'America/Sao_Paulo'})}** **${format(ts, 'HH:mm', { timeZone: 'America/Sao_Paulo' })}**`, `${texto}`)
			.setColor('#ffffff');
		return client.channels.get(environment.chats.changelog).send(logs);
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
const Discord = require('discord.js');
const util = require('../util');

const runCommand = async (client, message) => {
	if (
		message.channel.id === process.env.SUGGESTION_CHAT ||
		message.channel.id === process.env.SEARCH_CHAT
	) {
		await message.react('✅');
		await message.react('❌');
	}

	if (!util.isCommand(message)) return;

	const args = message.content
		.slice(process.env.PREFIX.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command);
	// if(message.channel.type !== "dm" && message.channel.id !== process.env.COMMANDS_CHAT && !message.member.roles.exists('id', process.env.ADMIN_ROLE) && message.channel.id !== process.env.COMMANDS_CHAT && !message.member.roles.exists('id', process.env.MOD_ROLE)) {
	//   message.delete().catch(() => {});
	//   return message.channel.send("``❌`` Use comandos no canal <#542840741588762637>.").then(msg => msg.delete(15000));
	// }
	if (message.channel.type == "dm" || command !== 'registrar') {
		message.delete().catch(() => {});
		return message.channel.send("``❌`` Use comandos no canal de comandos").then(msg => msg.delete(15000));
	}
	if (!cmd) return;

	message.delete().catch(() => {});

	console.log(
		'[#LOG]',
		`${message.author.username} (${message.author.id}) executou o comando: ${cmd.command.name}`
	);
	try {
		if (cmd.validate) {
			await cmd.validate(client, message, args);
		}
		await cmd.run(client, message, args);
		if (cmd.success) {
			await cmd.success(client, message, args);
		}
	} catch (err) {
		console.error(err);
		if (cmd.fail) {
			await cmd.fail(err, client, message, args);
			return;
		}
		const embed =
			util.translate(`${command}.fail.${err.message}`) ||
			util.translate(`${command}.fail.default`) ||
			util.translate(`error_command`, [command, err.message]);
		if (!embed.title) {
			embed.setTitle(
				`\`\`❌\`\` » ${process.env.PREFIX}${command}`
			);
		}
		if (!embed.color) {
			embed.setColor('#36393E');
		}
		await message.reply(embed).then(msg => msg.delete(15000));
		return;
	} finally {
		if (cmd.after) {
			await cmd.after(client, message, args);
		}
	}
};

module.exports = async (client, message) => {
	if (message.author.bot) return;

	if (message.content.toLowerCase() === 'boa noite') {
		message.react('💤');
		message.channel.send('noite!');
	}
	if (message.content.toLowerCase() === 'bom dia') {
		message.react('🌅');
		message.channel.send('dia!');
	}
	if (message.content.toLowerCase() === 'boa tarde') {
		message.react('🌞');
		message.channel.send('tarde!');
	}
	if (message.channel.id === process.env.APPRENTICESHIP_CHAT) {
		message.react(client.emojis.get('551856304759504910'));
		message.react(client.emojis.get('551856305007231033'));
		message.react(client.emojis.get('547614831432302631'));
	}

	await Promise.all([
		runCommand(client, message),
	]);
	// await Promise.bind(runCommand(client, message));
};
const { promisify } = require('util');
const Discord = require('discord.js');
const util = require('../util');
const roles = require('../../assets/roles.js');
const categories = require('../userCategory');
const langPTBR = require('../../assets/pt_BR');
const createPlayer = require('../api/services/createPlayer');

const TIMEOUT = 60 * 2000;

const RolesCategory = roles.categories_roles.map(cr => cr.id)
const RolesEng = roles.eng_roles.map(en => en.id)

const englishDescription = roles.eng_roles
	.map(engRole => `${engRole.react}  -  ${engRole.name}`)
	.join('\n');

const categoryDescriptionLines = roles.categories_roles
	.map(devRole => `${devRole.react}  -  ${devRole.name}`)
	.join('\n');

const categoryDescription = `${categoryDescriptionLines}\n\n\n✅ - Pronto.`;

const createEmbedResponse = ({ author, collectors, client }) =>
	new Discord.RichEmbed()
		.setTitle(`**Nome do Discord** » ${author.username}`)
		.setThumbnail(author.avatarURL)
		.setColor('#8146DC')
		.addField('**Nome:**', collectors.name.collected.first().content, true)
		.addField(
			'**Idade:**',
			collectors.age.collected.first().content,
		)
		.addField('**Objetivo:**', collectors.objective.collected.first().content, true)
		.addField('**Ultima Guild:**', collectors.guild.collected.first().content, true)
		.addField('**Set de Weapon:**', collectors.set.collected.first().content, true)
		.addField('**Horario:**', collectors.horario.collected.first().content, true)
		.addField(
			'**Set de Weapon:**',
			client.guilds
				.get(message.guild.id)
				.members.get(author.id)
				.roles.filter(role => RolesCategory.includes(role.id))
				.map(role => `<@&${role.id}>`)
				.join(', ') || '`Nenhuma`',
			true
		)
		.addField(
			'**English:**',
			client.guilds
				.get(message.guild.id)
				.members.get(author.id)
				.roles.filter(role => RolesEng.includes(role.id))
				.map(role => `<@&${role.id}>`)
				.join(', ') || '`Nenhuma`',
			true
		)
		.setFooter(
			util.getYear() + ' © PvP School'
		)
		.setTimestamp();
const isAuthor = (message, author) => message.author.id === author.id;
const collect = promisify((collector, cb) => {
	collector.on('end', (collected, reason) => {
		const collectedArray = collected.array();
		if (collectedArray.length) {
			cb(null, collectedArray);
		} else {
			cb(new Error(reason));
		}
	});
});
const collectMessage = message => {
	const collector = message.author.dmChannel.createMessageCollector(
		({ author }) => isAuthor(message, author),
		{ time: TIMEOUT }
	);
	collector.on('collect', msg => {
		if (!util.isCommand(msg)) {
			collector.stop();
		}
	});
	return collect(collector).then(() => collector);
};

const sendCategoryMessage = async author => {
	const message = await author.send(
		`${langPTBR.continuar.funcao.title}\n\n${categoryDescription}`
	);
	await message.react('1⃣')
	await message.react('2⃣')
	await message.react('3⃣')
	await message.react('4⃣')
	await message.react('5⃣')
	await message.react('✅')
	return message;
};
const collectCategoryReactions = async ({
	author,
	message,
	client,
	categoriesRoles,
}) => {
	const collector = message.createReactionCollector(
		(reaction, user) => isAuthor({ author }, user),
		{ time: TIMEOUT }
	);
	collector.on('collect', async reaction => {
		if (reaction.emoji.name === '✅') {
			collector.stop();
			return;
		}

		const emoji = reaction.emoji.name;
		const selectedRole = categoriesRoles.find(role => role.emoji === emoji);
		if (!selectedRole) {
			return;
		}

		await client.guilds
			.get(message.guild.id)
			.members.get(author.id)
			.addRole(selectedRole.id)
			.then(() => author.send('``✅`` TAG '+ `**${selectedRole.name}**`  +' adicionada com sucesso!'))
		 
	});
	return collect(collector).then(() => collector);
};

const sendEnglishMessage = async author => {
	const message = await author.send(
		`${langPTBR.continuar.english.title}\n\n${englishDescription}`
	);

	await	message.react('🇦'),
	await	message.react('🇧'),
	await	message.react('🇨')

	return message;
};
const collectEnglishReactions = async ({
	author,
	message, // message with english reactions
	client,
	engRoles,
}) => {
	const collector = message.createReactionCollector(
		(reaction, user) => isAuthor({ author }, user),
		{ time: TIMEOUT }
	);
	collector.on('collect', async reaction => {
		const emoji = reaction.emoji.name;
		const engRole = engRoles.find(role => role.react === emoji);
		if (!engRole) {
			return;
		}
		await client.guilds
			.get(message.guild.id)
			.members.get(author.id)
			.addRole(engRole.id);
		collector.stop();
	});
	return collect(collector).then(() => collector);
};
const cooldown = {};
module.exports = {
	run: async (client, message) => {
		if (cooldown[message.author.id]) {
			throw new Error('cooldown');
		}
		cooldown[message.author.id] = true;
		const categoriesRoles = roles.categories_roles;
		const engRoles = roles.eng_roles;
		const collectors = {};

		const presentedRole = client.guilds
			.get(message.guild.id)
			.roles.get(process.env.APRESENTOU);

		if (
			client.guilds
				.get(message.guild.id)
				.members.get(message.author.id)
				.roles.some(role => role.name === presentedRole.name)
		) {
			throw new Error('registered');
		}

		await message.author.send(langPTBR.continuar.name.title);
		collectors.name = await collectMessage(message);

		await message.author.send(langPTBR.continuar.nick.title);
		collectors.nick = await collectMessage(message);

		await message.author.send(langPTBR.continuar.age.title);
		collectors.age = await collectMessage(message);

		await message.author.send(langPTBR.continuar.objective.title);
		collectors.objective = await collectMessage(message);

		await message.author.send(langPTBR.continuar.guild.title);
		collectors.guild = await collectMessage(message);

		await message.author.send(langPTBR.continuar.weapon.title);
		collectors.weapon = await collectMessage(message);

		await message.author.send(langPTBR.continuar.set.title);
		collectors.set = await collectMessage(message);


		await message.author.send(langPTBR.continuar.horario.title);
		collectors.horario = await collectMessage(message);

		const categoryMessage = await sendCategoryMessage(message.author);
		await collectCategoryReactions({
			client,
			author: message.author,
			message: categoryMessage,
			categoriesRoles,
		});

		const englishMessage = await sendEnglishMessage(message.author);
		await collectEnglishReactions({
			client,
			author: message.author,
			message: englishMessage,
			engRoles,
		});

		createPlayer({
			discord: {
				id: message.author.id,
				discriminator: message.author.discriminator,
				username: message.author.username
			},
			guild: message.guild.id,
			name: collectors.name.collected.first().content,
			nick: collectors.nick.collected.first().content,
			age: collectors.age.collected.first().content,
			objective: collectors.objective.collected.first().content,
			guild: collectors.guild.collected.first().content,
			weapon: collectors.weapon.collected.first().content,
			sets: collectors.set.collected.first().content,
			horario: collectors.horario.collected.first().content,
		})

		// const embedResponse = createEmbedResponse({
		// 	collectors,
		// 	client,
		// 	author: message.author,
    // });
		
		
		// ADD ROLE DE JA APRESETOU
		await client.guilds
			.get(message.guild.id)
      .members
      .get(message.author.id)
      .addRole(process.env.APRESENTOU)
	},
	async fail(err, client, message) {
		if (err.message === 'cooldown') {
			const cooldownEmbed = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Você já utilizou este comando, verifique sua DM para mais informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(cooldownEmbed);
		}
		cooldown[message.author.id] = false;

		// geralmente quando user ta com dm desativada
		if (err.message === 'Cannot send messages to this user') {
			const dmDisabled = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Ops, seu privado está desativado e não consigo enviar algumas informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(dmDisabled);
		}
		if (err.message === 'registered') {
			return message.channel
				.send('``❌`` Você já se apresentou.')
				.then(msg => msg.delete(8000));
		}
		if (err.message === 'time') {
			const timeout = new Discord.RichEmbed()
				.setTitle('``❌`` **Tempo limite de resposta excedido.**')
				.setDescription(
					'Utilize `!registrar` para terminar sua apresentação.'
				)
				.setColor('#36393E');
			return message.author.send(timeout);
		}
		return null;
	},
	async success(client, message, args) {
		cooldown[message.author.id] = false;
		const success = new Discord.RichEmbed({
			title: '``✅`` **Apresentação finalizada com sucesso.**',
			color: 0x36393e,
		});
		await message.author.send(success);
	},
	get command() {
		return {
			name: 'registrar',
			category: categories.USER,
			description: 'O usuario irá continuar a apresentação.',
			usage: 'registrar',
		};
	},
};
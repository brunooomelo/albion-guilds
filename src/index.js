const Discord = require('discord.js');
const fs = require('fs-extra');
const path = require('path')
const Enmap = require('enmap');

const client = new Discord.Client({ forceFetchUsers: true });

require('dotenv').config();
client.commands = new Enmap();

const init = async () => {
	const cmdFiles = await fs.readdir(path.join(__dirname , 'commands'));
	console.log(
		'[#LOG]',
		`Carregando o total de ${cmdFiles.length - 1} comandos.`
	);
  cmdFiles.shift();
	cmdFiles.forEach(f => {
		try {
			const props = require(`./commands/${f}`);
			if (f.split('.').slice(-1)[0] !== 'js') return;
			if (props.init) {
				props.init(client);
			}
			client.commands.set(props.command.name, props);
		} catch (e) {
			console.log(`[#ERROR] Impossivel executar comando ${f}: ${e}`);
		}
	});

	const evtFiles = await fs.readdir(__dirname+ '/events/');
	console.log('[#LOG]', `Carregando o total de ${evtFiles.length} eventos.`);
	evtFiles.forEach(f => {
		const eventName = f.split('.')[0];
		const event = require(`./events/${f}`);

		client.on(eventName, event.bind(null, client));
	});

	client.on('error', err => console.error('[#ERROR]', err));
	
	client.login(process.env.TOKEN);
};
init();

module.exports = client.commands;
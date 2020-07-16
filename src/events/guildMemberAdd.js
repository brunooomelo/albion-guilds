
module.exports = async (client, member) => {
	// Mandar DM pra pessoa que entrou
	member.send(
		`:flag_br: Bem-vindo a **PvP School**!\n\n:white_small_square: Nós somos uma comunidade de auxilio a desenvolvedores e entusiastas com o intuito de proporcionar um networking entre os participantes desta comunidade;\n:white_small_square: É iniciante? Sem problemas, utilize os canais de ajuda e também visualize os tutoriais disponíveis em \n:white_small_square: Nossa intuição é sempre ajudar, você pode tanto contribuir quanto pedir ajuda, não precisa ter vergonha somos todos uma comunidade, nos visamos sempre ajudar o próximo, tanto a conseguir emprego, quanto com duvidas, quanto com a amizade! \n:white_small_square: Use \`!jobs\` para receber propostas de empregos especiais! :programathor:\n\n:exclamation: Você pode se apresentar utilizando o comando \`!apresentar\`, com isto toda a comunidade pode ter noção de quem você é, lembre-se que é **OPCIONAL** se identificar realmente, nesta seção você poderá selecionar também as linguagens que você gostaria de aprender ou trabalhar, além do acesso ao chat de ajuda das mesmas.`
	);


	const embed = {
	  "color": 8311585,
	  "timestamp": new Date(),
	  "footer": {
			"icon_url": client.user.avatarURL,
			"text": "Data de entrada"
		},
	  "author": {
		"name": member.user.username,
		"icon_url": member.user.avatarURL
	  },
	  "fields": [
		{
		  "name": "Bem vindo(a)",
		  "value": "Leia as <#464522380849709056> para não tomar KICK/BAN e mantenha um bom relacionamento com o pessoal :sunglasses: "
		}
	  ]
	};
	member.guild.channels.get("464520117770780678").send({embed});
};
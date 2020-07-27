const createDiscord = require('../api/services/createDiscord')

module.exports = async (client, member) => {
	// Mandar DM pra pessoa que entrou
	try {
		member.send(
			`:flag_br: Bem-vindo a **PvP School**!\n\n:white_small_square: Nós somos uma comunidade de auxilio a novos jogadores de albion;\n:white_small_square: É iniciante? Sem problemas, utilize os canais de ajuda e também visualize os tutoriais disponíveis em \n:white_small_square: Nossa intuição é sempre ajudar, você pode tanto contribuir quanto pedir ajuda, não precisa ter vergonha somos todos uma guilda unida, nos visamos sempre ajudar o próximo! \n\n:exclamation: Você pode se apresentar utilizando o comando \`!apresentar\`, com isto toda a comunidade pode ter noção de quem você é, lembre-se que é **OBRIGATORIO** se identificar para preencher a vaga na guilda, nesta seção você poderá selecionar também as armas usadas e quais os tipos de conteudo você gostaria, além do acesso ao chat de ajuda das mesmas.`
		);
		await createDiscord(member.user)
		console.log(`[#LOG] usuario entrou no servidor: ${member.user.username}`)
	} catch (error) {
		console.log(error.message)
		return error 
	}


	// const embed = {
	//   "color": 8311585,
	//   "timestamp": new Date(),
	//   "footer": {
	// 		"icon_url": client.user.avatarURL,
	// 		"text": "Data de entrada"
	// 	},
	//   "author": {
	// 		"name": member.user.username,
	// 		"icon_url": member.user.avatarURL
	//   },
	//   "fields": [
	// 	{
	// 	  "name": "Bem vindo(a)",
	// 	  "value": "Leia as <#464522380849709056> para não tomar KICK/BAN e mantenha um bom relacionamento com o pessoal :sunglasses: "
	// 	}
	//   ]
	// };
	// member.guild.channels.get(process).send({embed});
};
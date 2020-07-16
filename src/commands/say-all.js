const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client, message, args) {
    try {
      const msg = args.slice(0).join(' ');
      if (!msg) {
        return message
          .reply(':x: Voce deve informar uma mensagem')
          .then(msgn => msgn.delete(5000))
          .catch(err => console.log(err));
      }
      message.channel.send(
        'Enviando mensagem para todos os usuários...\n'
      );
      client.guilds.get(process.env.GUILD_ID).members.forEach(member => {
        if (!member.user.bot) {
          member.send(msg)
        }
      });
    } catch (error) {
      console.log('deu erro')
      return
    }
	
	},

	get command() {
		return {
			name: 'say-all',
			category: categories.ADM,
			description: 'Manda mensagem pra todos os usuários',
			usage: 'say-all <role> <msg>',
		};
	},
};
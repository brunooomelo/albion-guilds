
module.exports = async client => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'a qualidade que você procura 💻 | heartdevs.com',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/danielhe4rt',
		},
	});
};
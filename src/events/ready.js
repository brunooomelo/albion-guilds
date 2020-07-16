
module.exports = async client => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'A guilda mais procurada dos BR`s ',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/kygho',
		},
	});
};
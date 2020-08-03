module.exports = async client => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'Albion Online',
			status: 'PLAYING'
		},
	});
};
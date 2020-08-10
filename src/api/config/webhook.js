const Discord = require('discord.js')

module.exports = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)

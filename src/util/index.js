const _ = require('lodash')
const langPTBR = require('../../assets/pt_BR');
const Discord = require('discord.js')

module.exports = {
  isCommand: message =>
    message.content.startsWith(process.env.PREFIX),
  translate: (path, fields = [], templates) => {
    let data = _.cloneDeep(_.get(langPTBR, path));
    if (!data) {
      return null;
    }
    if (typeof data === 'string') {
      if (templates && typeof templates === 'object') {
        for (const name in templates) {
          data = data.replace(`{{${name}}}`, templates[name]);
        }
      }
      return data;
    }
    if (data.fields) {
      data.fields = data.fields.map((field, index) => ({
        ...field,
        value: fields[index],
      }));
    }
    if (data.color && data.color.startsWith('#')) {
      data.color = parseInt(data.color.slice(1), 16);
    }
    return new Discord.RichEmbed(data);
  },
  getYear: () => {
		current_date = new Date();
		return current_date.getYear();
	},
}
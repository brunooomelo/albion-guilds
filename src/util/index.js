const _ = require('lodash')
const langPTBR = require('../../assets/pt_BR')
const Discord = require('discord.js')
const { cached } = require('./cache')

module.exports = {
  isCommand: (message, prefix = '!') =>
    message.content.startsWith(prefix),
  translate: (path, fields = [], templates) => {
    let data = _.cloneDeep(_.get(langPTBR, path))
    if (!data) {
      return null
    }
    if (typeof data === 'string') {
      if (templates && typeof templates === 'object') {
        for (const name in templates) {
          data = data.replace(`{{${name}}}`, templates[name])
        }
      }
      return data
    }
    if (data.fields) {
      data.fields = data.fields.map((field, index) => ({
        ...field,
        value: fields[index]
      }))
    }
    if (data.color && data.color.startsWith('#')) {
      data.color = parseInt(data.color.slice(1), 16)
    }
    return new Discord.RichEmbed(data)
  },
  getYear: () => {
    return new Date().getFullYear()
  },
  verifyPermission: async (permission, guildId) => {
    const { environment } = await cached.getConfig(guildId)
    return permission.get(environment.roles.permission)
  },
  transform: (labelValue) => {
    return Math.abs(Number(labelValue)) >= 1.0e+9
      ? Math.abs(Number(labelValue)) / 1.0e+9 + 'B'
      : Math.abs(Number(labelValue)) >= 1.0e+6
        ? Math.abs(Number(labelValue)) / 1.0e+6 + 'M'
        : Math.abs(Number(labelValue)) >= 1.0e+3
          ? Math.abs(Number(labelValue)) / 1.0e+3 + 'K'
          : Math.abs(Number(labelValue))
  },
  sanitilize: (data) => data
    .split('\n')
    .map((y, index) => {
      if (index === 0) {
        return
      }
      const dados = y.split('\t')
      if (dados.length !== 4) {
        return
      }
      const dadosFormatados = dados.map((dd) => {
        return dd.replace(/"/g, '')
      })
      return {
        timestamp: dadosFormatados[0],
        nickName: dadosFormatados[1],
        action: dadosFormatados[2],
        value: dadosFormatados[3]
      }
    })
    .filter(d => (d))
}

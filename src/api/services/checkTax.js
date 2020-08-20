const { sanitilize } = require('../../util')
const Tax = require('../models/tax')

module.exports = async (doc, token) => {
  let taxes = {}
  sanitilize(doc).filter((m) => {
    return m.action === 'Depósito'
  }).map((t) => {
    if (taxes[t.nickName]) {
      taxes = {
        ...taxes,
        [t.nickName]: {
          action: t.action,
          value: String(parseInt(t.value) + parseInt(taxes[t.nickName].value))
        }
      }
      return t
    }
    taxes = {
      ...taxes,
      [t.nickName]: {
        action: t.action,
        value: t.value
      }
    }
    return t
  })

  const tax = await Tax.findOne({ token, status: 'closed' }).limit(1)
  if (!tax) {
    return 'nao tem evento aberto'
  }

  const nopaid = tax.members.filter((m) => {
    if (!taxes[m]) {
      return true
    }
    return tax.value < taxes[m].value
  })

  const paid = tax.members.filter((m) => {
    if (!taxes[m]) {
      return false
    }
    return tax.value >= taxes[m].value
  })

  tax.status = 'finished'
  tax.noPaid = nopaid
  tax.paid = paid
  tax.token = ''
  await tax.save()
  return {
    nopaid,
    paid
  }
}

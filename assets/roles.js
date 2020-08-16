module.exports = ({ roles }) => {
  return ({
    categories_roles: [
      {
        name: 'DPS',
        emoji: '1⃣',
        id: roles.dps,
        react: ':one:'
      },
      {
        name: 'HEALER',
        emoji: '2⃣',
        id: roles.healer,
        react: ':two:'
      },
      {
        name: 'SUPORTE',
        emoji: '3⃣',
        id: roles.support,
        react: ':three:'
      },
      {
        name: 'TANK',
        emoji: '4⃣',
        id: roles.tank,
        react: ':four:'
      },
      {
        name: 'COLETOR',
        emoji: '5⃣',
        id: roles.collector,
        react: ':five:'
      }
    ],
    eng_roles: [
      {
        name: 'Básico',
        react: '🇦',
        id: process.env.ENG_BASIC
      },
      {
        name: 'Intermediário',
        react: '🇧',
        id: process.env.ENG_INTER
      },
      {
        name: 'Avançado',
        react: '🇨',
        id: process.env.ENG_AVAN
      }
    ]
  })
}

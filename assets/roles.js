module.exports = {
  "categories_roles": [
    {
      "name": "DPS",
      "emoji": "1⃣",
      "id": process.env.DPS_ROLE,
      "react": ":one:"
    },
    {
      "name": "HEALER",
      "emoji": "2⃣",
      "id": process.env.HEALER_ROLE,
      "react": ":two:"
    },
    {
      "name": "SUPORTE",
      "emoji": "3⃣",
      "id": process.env.SUPPORT_ROLE,
      "react": ":three:"
    },
    {
      "name": "TANK",
      "emoji": "4⃣",
      "id": process.env.TANK_ROLE,
      "react": ":four:"
    },
    {
      "name": "COLETOR",
      "emoji": "5⃣",
      "id": process.env.COLLECTOR_ROLE,
      "react": ":five:"
    }
  ],
    "eng_roles" : [
      {
        "name": "Básico",
        "react": "🇦",
        "id": process.env.ENG_BASIC
      },
      {
        "name": "Intermediário",
        "react": "🇧",
        "id": process.env.ENG_INTER
      },
      {
        "name": "Avançado",
        "react": "🇨",
        "id": process.env.ENG_AVAN
      }
    ]
}
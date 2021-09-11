//
// Activités personnalisées du bot.
//
const activities = [
	"Macron à Marseille / Les Marseillais à L'Elysée ",
	"Attention ! Risque de chute de Karim sur l'aéroport de Kaboul",
	"« Les mots construisent des ponts vers des régions inexplorées » - A. Hitler",
	"Zemmour vs Marine",
	"Talibans Lives Matter",
	"#Zemmour2022",
	"Propriétaire d'un bar gay à La Mecque",
	"Made by FlOwOrian",
	"LGBT is not okay, heterosexuality is natural law"
]

module.exports = {

	// Définition de l'activité.
	setActivity: (bot, name, type = "PLAYING") => {

		bot.user.setActivity(name, {
			type: type
		})

		console.log(`Nouvelle activité Discord : « ${name} ».`)

	},

	// Randomisation de l'activité.
	randomActivity: (bot) => {

		var index = Math.floor(Math.random() * (activities.length - 1) + 1)

		module.exports.setActivity(bot, activities[index])

	}

}
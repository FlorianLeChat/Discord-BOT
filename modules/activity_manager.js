//
// Activités personnalisées du bot.
//
const activities = [
	"Marine contre les incivilités",
	"Affronte les arabes",
	"#TeamJUL",
	"Macron vs Marine",
	"Allah akbar",
	"Niko la grosse merde",
	"White Lives Matter",
	"Thaïs <3",
	"Made by Florian :D",
	"Wallah j'te braque",
	"One Two Three, viva la guerre d'Algérie"
]

module.exports = {

	// Définition de l'activité.
	setActivity: (bot, name, type = "WATCHING") => {

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
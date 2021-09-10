//
// Gestion du démarrage
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
];

const activity = (bot) =>
{
	var index = Math.floor(Math.random() * (activities.length - 1) + 1);

	bot.user.setActivity(activities[index], {type: "WATCHING"})

	console.log(`Nouvelle activité Discord : \`${activities[index]}\`.`)
};

module.exports = activity
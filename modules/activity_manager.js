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

const updateActivity = async() => {
	let index = Math.floor(Math.random() * (activities.length - 1) + 1);

	bot.user.setActivity(activities[index], {type: "WATCHING"})
		.then(() => console.log(`Nouvelle activité Discord : \`${activities[index]}\`.`))
		.catch(console.error);
};

bot.on("ready", async() => {
	console.log(`Le robot \"${bot.user.username}\" a démarré avec succès.`);
	console.log(`Le robot est actuellement connecté sur ${bot.guilds.cache.size} serveurs.`);

	updateActivity()

	// Note : 1000 ms => 1 seconde * <temps en secondes> (ex: 600 secondes = 10 minutes).
	setInterval(() => {
		updateActivity()
	}, 1000 * 600);

	// Seulement pour le système du NNN.
	// createMessage();

	// setInterval(() => {
	// 	let timestamp = new Date();
	// 	timestamp = timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();

	// 	if (timestamp == "0:0:0")
	// 	{
	// 		days++;
	// 		createMessage();
	// 	}
	// }, 1000);
});
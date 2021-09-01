const discord = require("discord.js");
const fileSystem = require("fs");
const bot = new discord.Client();

bot.commands = new discord.Collection();

//
// Chargement des scripts de commandes du bot.
//
const commandFiles = fileSystem.readdirSync("./commands").filter(file => file.endsWith(".js"));

if (commandFiles.length > 0)
{
	commandFiles.forEach(file => {
		const command = require(`./commands/${file}`);

		console.log(`Le fichier ${file} a été chargé.`);

		bot.commands.set(command.name, command);
	});

	console.log(`${commandFiles.length} fichiers ont été chargés.`);
}
else
{
	console.log("Aucune commande est actuellement disponible.");
};

//
// Gestion des tweets
//
const follows = [
	"217749896", // Marine <3
	"338985020", // AFP (FR)
	"24744541", // Le Monde (FR)
	"1001029225476972545", // Ministère de l'Intérieur (FR)
	"2097571", // CNN International (US)
	"742143", // BBC World (UK)
];

let twitter = require("twit");
let client = new twitter({
	consumer_key: "dllmjysJTbcTHCwYyUJ3srpX2",
	consumer_secret: "G34lqK46KFWxZBSQ275FimdhtdiTE5LLLuPCoWJ87RhV8dA87t",
	access_token: "731431438562775040-l86j0BlZD8vhhTCN4wVgGwsxHP2HIKh",
	access_token_secret: "ek07nsKr0VR0aEJvlKjPdGPu5HoPOoc4wP3NUMJ0twMmT"
});

let stream = client.stream("statuses/filter", { follow: follows, track: "RT -filter:retweets" });

stream.on("tweet", function(tweet) {
	if (!follows.includes(tweet.user.id_str))
		return;

	let countryFlag = ":flag_fr:";

	switch (tweet.user.id_str)
	{
		case "2097571": // CNN
			countryFlag = ":flag_us:";
			break;
		case "742143": // BBC
			countryFlag = ":flag_gb:";
			break;
		case "1001029225476972545": // Ministère de l'Intérieur
			countryFlag = ":rotating_light: @everyone";
			break;
		case "217749896": // Marine
			countryFlag += " <@183272411167326209> <@407212462740340747>";
			break;
	};

	bot.channels.cache.get("740960089195937873").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str} ${countryFlag}`);
});

//
// Spécialité du "No Nuts November".
//
// const excluders = []
// let users = JSON.parse(fileSystem.readFileSync("./nnn.json", "utf8"));
// let days = 1;
// let message;

// const createMessage = async() => {
// 	let phrase = `:spy: :sweat_drops: Statut « **No Nuts November** » (Jour ${days}) :\n`;

// 	phrase += "\n:point_right: Pour prendre en compte votre présence, réagissez à ce message !\n";

// 	bot.guilds.cache.get("473298739558350850").members.cache.forEach(member => {
// 		if (member.user.bot)
// 			return;

// 		if (excluders.includes(member.user.id))
// 			return;

// 		phrase += `- __${member.user.username}__ : J+${users[member.id] || 0}\n`;
// 	});

// 	phrase += "\n**Ces valeurs sont actualisées tous les jours à minuit.** :point_up_2:";

// 	if (message) {
// 		message.edit(phrase);
// 		message.reactions.removeAll()
// 			.catch(console.error);
// 	}
// 	else
// 	{
// 		message = await bot.channels.cache.get("772443354679869470").send(phrase);
// 	};
// };

// const updateCount = async(reaction, user, type) => {
// 	if (reaction.message.author.id != "468066164036206602" || !reaction.message.content.includes("No Nuts November"))
// 		return;

// 	if (excluders.includes(user.id))
// 		return;

// 	users[user.id] = days;

// 	if (type == true)
// 	{
// 		if (users[user.id] >= days + 1)
// 			return;

// 		users[user.id]++;
// 	}

// 	fileSystem.writeFile("./nnn.json", JSON.stringify(users), console.error);
// };

// bot.on("messageReactionAdd", async(reaction, user) => {
// 	updateCount(reaction, user, true)
// });

// bot.on("messageReactionRemove", async(reaction, user) => {
// 	updateCount(reaction, user, false)
// });

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

//
// Gestion des messages
//
const { prefix, token } = require("./config.json");
const cooldowns = new discord.Collection();

const messageHandler = async(message) => {
	//
	// Permet d'informer l'utilisateur qu'il a mentionné le robot sans raison.
	//
	if (message.mentions.has(bot.user) && !message.mentions.everyone)
	{
		message.reply("Pourquoi mentionner un bot ? :robot:")
		return;
	};

	//
	// Permet de ne pas prendre en compte les messages du bot ou ceux en messages privés.
	//
	if (message.author.bot || message.channel.type == "dm")
		return;

	//
	// Permet de répondre automatiquement lors de certaines phrases de salutations.
	//
	if (message.content == "Bonjour" || message.content == "Coucou" || message.content == "Salut")
		return message.reply("Bonjour à toi, jeune entrepreneur !");

	//
	// Permet de pas exécuter le reste du code tant que le joueur n'a pas mis le préfix pour les commandes du bot.
	//
	if (!message.content.startsWith(prefix))
		return;

	//
	// Permet de vérifier la commande (ou son alias) existe.
	//
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command)
		return;

	//
	// Permet de mettre un délai entre chaque exécution de commande.
	// Note : cela s'applique seulement aux non-administrateurs.
	//
	if (!message.member.hasPermission("MANAGE_MESSAGES"))
	{
		if (!cooldowns.has(command.name))
			cooldowns.set(command.name, new discord.Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = 3000;

		if (timestamps.has(message.author.id))
		{
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime)
			{
				const timeLeft = (expirationTime - now) / 1000;

				message.delete();

				return message.reply(`Vous devez attendre ${timeLeft.toFixed(1)} secondes entre chaque exécution de commandes.`);
			};
		};

		timestamps.set(message.author.id, now);

		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	};

	//
	// Permet de vérifier la présence d'arguments nécessaires pour l'exécution de la commande.
	//
	if (command.args && !args.length || message == "help")
	{
		let reply = "Des arguments sont nécessaires pour exécuter cette commande.";

		if (command.usage)
			reply += `\nUtilisation: \`${prefix}${command.name} ${command.usage}\``;

		return message.reply(reply);
	};

	//
	// Permet d'exécuter (si possible) la commande.
	//
	try {
		command.execute(bot, message, args);
	} catch (error) {
		console.error;
		message.reply(`Une erreur interne est survenue lors de l'exécution de la commande \`${command.name}\`:\n\`${error.message}\`.`);
	};
};

bot.on("message", async(message) => {
	messageHandler(message);
});

bot.on("messageUpdate", async(_oldMessage, newMessage) => {
	messageHandler(newMessage);
});

bot.login(token);
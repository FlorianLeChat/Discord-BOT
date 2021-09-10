//
// Gestion des messages
//
const prefix = require("./config.json");
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

bot.on("messageCreate", async(message) => {
	messageHandler(message);
});

bot.on("messageUpdate", async(_oldMessage, newMessage) => {
	messageHandler(newMessage);
});
const fileSystem = require("fs");

module.exports = {
	name: "botcmds",
	description: "[BOT] Permet d'obtenir toutes les commandes du robot.",
	aliases: ["cmds", "cmdslist", "listcmds", "commands"],
	execute(_bot, message, _args) {
		message.delete();

		const commandFiles = fileSystem.readdirSync("./commands").filter(file => file.endsWith(".js"));

		if (commandFiles.length <= 0)
			return message.reply("Aucune commande est actuellement disponible.");

		let commands = "";

		for (const file of commandFiles) {
			let props = require(`./${file}`);

			// Si le message est en phase d'atteindre la limite des 2000 caractères,
			// Alors, on divise en plusieurs fois les commandes pour éviter ça.
			if (commands.length > 1500)
			{
				message.author.send(commands);
				commands = "";
			}

			commands += `**${props.name}**\n*${props.description}*\n${props.usage || "Non spécifié"}\n\n`;
		};

		message.reply("Les commandes ont été envoyés via message privé.").then(reply => reply.delete({ timeout: 5000 }));;
		message.author.send(commands);
	},
};
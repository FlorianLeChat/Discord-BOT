const errors = require("../utils/errors.js");

module.exports = {
	name: "reload",
	description: "[BOT] Permet de recharger une commande sans redémarrer le bot.",
	usage: "<Nom de la commande>",
	aliases: ["r"],
	args: true,
	execute(_bot, message, args) {
		if (!message.member.id == "183272411167326209")
			return errors.noPerms(message, "PRIVATE");

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		if (!args.length)
			return message.reply("Vous devez renseigner le nom d'une commande.");

		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command)
			return message.reply(`Il n'y a aucune commande ou alias qui correspond à \`${commandName}\`.`);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.error(error);
			message.reply(`Une erreur interne est survenue lors du rechargement de la commande \`${command.name}\`:\n\`${error.message}\`.`);
		}

		message.reply(`La commande \`${command.name}\` a été rechargée avec succès.`);
	},
};
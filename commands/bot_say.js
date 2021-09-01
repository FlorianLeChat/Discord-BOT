const errors = require("../utils/errors.js");

module.exports = {
	name: "botsay",
	description: "[BOT] Permet de faire parler le robot.",
	usage: "<Message pour le bot>",
	aliases: ["say"],
	args: true,
	execute(_bot, message, args) {
		if (!message.member.hasPermission("ADMINISTRATOR"))
			return errors.noPerms(message, "ADMINISTRATOR");

		if (!args[0] || args == "help")
			return message.reply("Utilisation: !botsay <Paroles que vous voulez faire dire au robot>");

		const botmessage = args.join(" ");

		if (!botmessage)
			return message.reply("Veuillez spécifier un message à dire au robot.");

		message.channel.send(botmessage);
	},
};
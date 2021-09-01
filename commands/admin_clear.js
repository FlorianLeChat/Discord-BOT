const errors = require("../utils/errors.js");

module.exports = {
	name: "clear",
	description: "[ADMIN] Permet de supprimer un nombre de messages prédéfini dans un canal écrit.",
	usage: "<Nombre de lignes dans le chat actuel à supprimer (Entre 1 et 100)>",
	args: true,
	execute(_bot, message, args) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.member.id_str != "183272411167326209")
			return errors.noPerms(message, "MANAGE_MESSAGES");

		if (args[0] < 1 || args[0] > 100)
			return message.reply("Veuillez indiquer un nombre compris entre 1 et 100.");

		message.delete();

		message.channel.messages.fetch({ limit: args[0] }, true)
			.then(messages => {
				message.channel.bulkDelete(messages)
					.catch(console.error);
			})
			.catch(console.error);

		message.channel.send(`Suppression de ${args[0]} message(s).`).then(message => message.delete({ timeout: 3000 }));
	},
};
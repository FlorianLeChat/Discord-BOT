const errors = require("../utils/errors.js");
const fileSystem = require("fs");

module.exports = {
	name: "warnlevel",
	description: "[ADMIN] Permet de vérifier le nombre d'avertissements d'un utilisateur.",
	usage: "<Utilisateur visé>",
	args: true,
	execute(bot, message, _args) {
		if (!message.member.hasPermission("MANAGE_MESSAGES"))
			return errors.noPerms(message, "MANAGE_MESSAGES");

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const user = message.guild.member(message.mentions.users.first()) || message.member || message.user;

		if (!user)
			return errors.cantFindUser(message);

		if (user.id === message.author.id)
			return errors.sameUser(message);

		if (user.id === bot.user.id)
			return errors.botUser(message);

		if (user.hasPermission("MANAGE_MESSAGES"))
			return errors.equalPerms(message, user, "MANAGE_MESSAGES");

		let warns = JSON.parse(fileSystem.readFileSync("./warnings.json", "utf8"))

		if (!warns[user.id])
			warns[user.id] = 0;

		message.channel.send(`<@${user.id}> a actuellement ${warns[user.id]} avertissement(s).`);
	},
};
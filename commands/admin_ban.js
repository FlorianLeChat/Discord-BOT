const discord = require("discord.js");
const errors = require("../utils/errors.js");
const { red } = require("../config.json");

module.exports = {
	name: "ban",
	description: "[ADMIN] Permet de bannir un utilisateur du serveur.",
	usage: "<Utilisateur visé> <Durée du bannissement> <Raison du bannissement>",
	aliases: ["b"],
	args: true,
	execute(bot, message, args) {
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return errors.noPerms(message, "BAN_MEMBERS");

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const user = message.guild.member(message.mentions.users.first()) || message.member || message.user;

		if (!user)
			return errors.cantFindUser(message);

		if (user.id === message.author.id)
			return errors.sameUser(message);

		if (user.id === bot.user.id)
			return errors.botUser(message);

		if (user.hasPermission("BAN_MEMBERS"))
			return errors.equalPerms(message, user, "BAN_MEMBERS");

		let length = args.splice(1, 1);
		length = length.join(" ");

		if (!length)
			return errors.noLength(message);

		let reason = args.splice(1);
		reason = reason.join(" ");

		if (!reason)
			return errors.noReason(message);

		const embed = new discord.MessageEmbed()
		.setColor(red)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Bannissement du serveur")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Détails du bannissement")
		.setImage("https://media.giphy.com/media/qPD4yGsrc0pdm/giphy.gif")
		.addField("Joueur banni:", `${user} avec l'ID: ${user.id}`)
		.addField("Banni par:", `${message.author} avec l'ID: ${message.author.id}`)
		.addField("Bannis dans:", message.channel)
		.addField("Date:", message.createdAt)
		.addField("Durée:", `${length} minutes (${length / 1440} jour(s)`)
		.addField("Raison:", reason);

		// message.guild.member(user).ban({ days: length, reason: reason });

		message.channel.send(embed);
	},
};
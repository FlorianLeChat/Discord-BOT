const discord = require("discord.js");
const errors = require("../utils/errors.js");
const fileSystem = require("fs");
const { red } = require("../config.json");

let warns = JSON.parse(fileSystem.readFileSync("./warnings.json", "utf8"))

module.exports = {
	name: "addwarn",
	description: "[ADMIN] Permet d'avertir un utilisateur avec une raison.",
	usage: "<Utilisateur visé> <Raison de son avertissement>",
	args: true,
	execute(bot, message, args) {
		message.delete();

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

		let reason = args.splice(1);
		reason = reason.join(" ");

		if (!reason)
			return errors.noReason(message);

		if (!warns[user.id])
			warns[user.id] = 0;

		warns[user.id]++;

		const embed = new discord.MessageEmbed()
		.setColor(red)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Avertissement")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Détails de l'avertissement")
		.setImage("https://media.giphy.com/media/Y5wlazC8lSVuU/giphy.gif")
		.addField("Joueur averti:", `${user} avec l'ID: ${user.id}`)
		.addField("Averti par:", `${message.author} avec l'ID: ${message.author.id}`)
		.addField("Nombre d'avertissements:", warns[user.id])
		.addField("Date:", message.createdAt)
		.addField("Raison:", reason);

		message.channel.send(embed);

		if (warns[user.id] >= 3) {
			// message.guild.member(user).ban({ days: 1, reason: reason });
			message.channel.send(`<@${user.id}> a été banni automatiquement 24 heures à cause du nombre de ses avertissements (${warns[user.id]}).`);

			if (warns[user.id])
				warns[user.id] = 0;
		}

		fileSystem.writeFile("./warnings.json", JSON.stringify(warns), console.error);
	},
};
const discord = require("discord.js");
const errors = require("../utils/errors.js");
const { red } = require("../config.json");

module.exports = {
	name: "report",
	description: "[USER] Permet de signaler un comportement malveillant d'un utilisateur.",
	usage: "<Utilisateur visé> <Raison de son signalement>",
	args: true,
	execute(bot, message, args) {
		message.delete();

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const user = message.guild.member(message.mentions.users.first()) || message.member || message.user;

		if (!user)
			return errors.cantFindUser(message);

		if (user.id === message.author.id)
			return errors.sameUser(message);

		if (user.id === bot.user.id)
			return errors.botUser(message);

		let reason = args.splice(1);
		reason = reason.join(" ");

		if (!reason)
			return errors.noReason(message);

		const embed = new discord.MessageEmbed()
		.setColor(red)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Signalement")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Détails du signalement")
		.setImage("https://media.giphy.com/media/Q87XzlKSuHqnT2FEHE/giphy.gif")
		.addField("Joueur signalé:", `${user} avec l'ID: ${user.id}`)
		.addField("Signalé par:", `${message.author} avec l'ID: ${message.author.id}`)
		.addField("Salon:", message.channel)
		.addField("Date:", message.createdAt)
		.addField("Raison:", reason);

		message.guild.members.cache.forEach(async(member) => {
			if (member.hasPermission("MANAGE_MESSAGES"))
				member.send(embed);
		});
	},
};
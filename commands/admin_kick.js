const discord = require("discord.js");
const errors = require("../utils/errors.js");
const { red } = require("../config.json");

module.exports = {
	name: "kick",
	description: "[ADMIN] Permet d'expulser un utilisateur du serveur.",
	usage: "<Utilisateur visé> <Raison de son expulsion>",
	aliases: ["k"],
	args: true,
	execute(bot, message, args) {
		if (!message.member.hasPermission("KICK_MEMBERS"))
			return errors.noPerms(message, "KICK_MEMBERS");

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const user = message.guild.member(message.mentions.users.first()) || message.member || message.user;

		if (!user)
			return errors.cantFindUser(message);

		if (user.id === message.author.id)
			return errors.sameUser(message);

		if (user.id === bot.user.id)
			return errors.botUser(message);

		if (user.hasPermission("KICK_MEMBERS"))
			return errors.equalPerms(message, user, "KICK_MEMBERS");

		let reason = args.splice(1);
		reason = reason.join(" ");

		if (!reason)
			return errors.noReason(message);

		const embed = new discord.MessageEmbed()
		.setColor(red)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Explusion du serveur")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Détails de l'expulsion")
		.setImage("https://media.giphy.com/media/mxQUQbIjXMSwo/giphy.gif")
		.addField("Joueur expulsé:", `${user} avec l'ID: ${user.id}`)
		.addField("Expulsé par:", `${message.author} avec l'ID: ${message.author.id}`)
		.addField("Expulsé dans:", message.channel)
		.addField("Date:", message.createdAt)
		.addField("Raison:", reason);

		// message.guild.member(user).kick(reason);

		message.channel.send(embed);
	},
};
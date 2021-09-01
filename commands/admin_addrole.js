const discord = require("discord.js");
const errors = require("../utils/errors.js");
const { aqua } = require("../config.json");

module.exports = {
	name: "addrole",
	description: "[ADMIN] Permet d'ajouter un rôle à un utilisateur.",
	usage: "<Utilisateur visé> <Nom du groupe que vous voulez lui ajouter>",
	aliases: ["add"],
	args: true,
	execute(bot, message, args) {
		if (!message.member.hasPermission("MANAGE_ROLES"))
			return errors.noPerms(message, "MANAGE_ROLES");

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const user = message.guild.member(message.mentions.users.first()) || message.member || message.user;

		if (!user)
			return errors.cantFindUser(message);

		if (user.id === message.author.id)
			return errors.sameUser(message);

		if (user.id === bot.user.id)
			return errors.botUser(message);

		if (user.hasPermission("MANAGE_ROLES"))
			return errors.equalPerms(message, user, "MANAGE_ROLES");

		let role = args.splice(1);
		role = role.join(" ");

		if (!role)
			return message.reply("Veuillez spécifier un rôle.");

		const target = message.guild.roles.cache.find(rank => rank.name === role);

		if (!target)
			return message.reply("Ce rôle est introuvable.");

		if (user.roles.cache.has(target.id))
			return message.reply("Cet utilisateur possède déjà ce rôle.");

		const embed = new discord.MessageEmbed()
		.setColor(aqua)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Promotion dans un groupe d'utilisateurs")
		.setThumbnail(message.guild.iconURL())
		.setDescription(`<@${user.id}> a obtenu(e) le rôle suivant : \`${target.name}\`.`)
		.setImage("https://media.giphy.com/media/xUOxfg0ESyhKOv4Vva/giphy.gif")

		message.channel.send(embed);

		// user.addRole(target.id);
	},
};
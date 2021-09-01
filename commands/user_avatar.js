const discord = require("discord.js");
const errors = require("../utils/errors.js");
const { blue } = require("../config.json");

module.exports = {
	name: "avatar",
	description: "[USER] Permet d'obtenir l'avatar d'un utilisateur sur ce serveur Discord.",
	usage: "<Utilisateur visé pour voir son avatar>",
	args: true,
	execute(_bot, message, _args) {
		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const user = message.mentions.users.first() || message.member.user || message.user;

		if (!user)
			return errors.cantfindUser(message);

		const embed = new discord.MessageEmbed()
		.setColor(blue)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Avatar de l'utilisateur")
		.setURL(message.author.avatarURL())
		.setThumbnail(message.guild.iconURL())
		.setDescription(`Voilà l'avatar de ${user} !`)
		.setImage(user.avatarURL());

		message.channel.send(embed);
	},
};
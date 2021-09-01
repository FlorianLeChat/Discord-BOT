const discord = require("discord.js");
const { orange } = require("../config.json");

module.exports = {
	name: "userinfo",
	description: "[USER] Permet d'obtenir des informations à propos du compte Discord.",
	aliases: ["server"],
	execute(_bot, message, _args) {
		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const embed = new discord.MessageEmbed()
		.setColor(orange)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Utilisateur")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Informations à propos de l'utilisateur")
		.addField("Nom:", message.author.username)
		.addField("Créé le:", message.author.createdAt)
		.addField("ID:", message.author.id)

		message.channel.send(embed);
	},
};
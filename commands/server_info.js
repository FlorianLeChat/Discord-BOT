const discord = require("discord.js");
const { orange } = require("../config.json");

module.exports = {
	name: "serverinfo",
	description: "[SERVER] Permet d'obtenir des informations sur le serveur Discord.",
	aliases: ["server"],
	execute(_bot, message, _args) {
		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const embed = new discord.MessageEmbed()
		.setColor(orange)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Serveur")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Informations à propos du serveur")
		.addField("Nom du serveur:", message.guild.name)
		.addField("Créé le:", message.guild.createdAt)
		.addField("Vous l'avez rejoint le:", message.member.joinedAt)
		.addField("Membres au total:", message.guild.memberCount);

		message.channel.send(embed);
	},
};
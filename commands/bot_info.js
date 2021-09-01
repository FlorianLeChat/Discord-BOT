const discord = require("discord.js");
const { blue } = require("../config.json");

module.exports = {
	name: "botinfo",
	description: "[BOT] Permet d'obtenir des informations sur le robot.",
	aliases: ["bot"],
	execute(bot, message, _args) {
		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const embed = new discord.MessageEmbed()
		.setColor(blue)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Robot")
		.setURL(message.author.avatarURL())
		.setThumbnail(message.guild.iconURL())
		.setDescription("Informations à propos du robot")
		.setImage(bot.user.avatarURL())
		.addField("Nom du robot:", bot.user.username)
		.addField("Créé le:", bot.user.createdAt);

		message.channel.send(embed);
	},
};
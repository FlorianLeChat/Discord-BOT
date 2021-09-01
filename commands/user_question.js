const discord = require("discord.js");
const { green } = require("../config.json");
const replies = ["Oui", "Non", "Je ne sais pas", "Demandez moi plus tard"];

module.exports = {
	name: "question",
	description: "[USER] Permet de poser une question et d'obtenir une réponse aléatoire du robot.",
	usage: "<Question que vous voulez poser au robot>",
	args: true,
	execute(_bot, message, args) {
		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		const question = args.join(" ");
		const randomReply = Math.floor(Math.random() * 4);

		const embed = new discord.MessageEmbed()
		.setColor(green)
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setTitle("Questions/Réponses")
		.setThumbnail(message.guild.iconURL())
		.setDescription("Réponse à la question posée")
		.addField("Question:", question)
		.addField("Réponse:", replies[randomReply]);

		message.channel.send(embed);
	},
};
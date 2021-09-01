const discord = require("discord.js");
const request = require("superagent");
const { green, red } = require("../config.json");

module.exports = {
	name: "dog",
	description: "[FUN] Permet d'afficher une image aléatoire de chien.",
	aliases: ["dogo"],
	execute(_bot, message, _args) {
		request
		.get("https://random.dog/woof.json")
		.end((error, result) => {
			message.delete();

			if (!message.guild.available)
				return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

			if (error)
			{
				const embed = new discord.MessageEmbed()
				.setColor(red)
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setTitle("Chien random")
				.setURL("https://random.dog")
				.setThumbnail(message.guild.iconURL())
				.setDescription("Échec lors de la récupération de l'image")
				.setImage("https://media.giphy.com/media/tJeGZumxDB01q/giphy.gif");

				message.channel.send(embed);
			}
			else
			{
				const dog = result.body.url;
				const embed = new discord.MessageEmbed()
				.setColor(green)
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setTitle("Chien random")
				.setURL("https://random.dog")
				.setThumbnail(message.guild.iconURL())
				.setDescription("Un chien ! :dog:")
				.setImage(dog);

				message.channel.send(embed);

				// Le site peut également donner une vidéo au lieu d'une image.
				// Malheureusement, les embeds de Discord ne les supporte pas.
				// Donc, on envoie un message contenant l'URL de la vidéo.
				if (dog.endsWith(".mp4"))
				{
					message.channel.send(dog);
				}
			}
		});
	},
};
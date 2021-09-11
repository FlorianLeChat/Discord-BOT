//
// Création des commandes personnalisées.
//
const discord = require("discord.js")
const fileSystem = require("fs")

const settings = require("./data/__internal__.json")

module.exports.createCommands = async(bot) => {

	fileSystem.readdir("./commands/", async(error, files) => {

		// On vérifie s'il n'y a pas une erreur interne avec le système de fichiers.
		// Note : on en profite pour envoyer une notification à un Discord de débogage.
		if (error)
		{
			bot.channels.fetch(settings.masterChannel).then(channel => {

				const messageEmbed = new discord.MessageEmbed()
					.setColor(settings.redColor)
					.setAuthor(bot.user.username, bot.user.avatarURL())
					.setTitle("Erreur du système de fichiers")
					.setDescription("Une erreur interne s'est produite lors de la récupération des commandes.")
					.addField("Message d'erreur :", error);

				channel.send({ embeds: [ messageEmbed ] });

			})

			return
		}

		// On récupère alors le résultat et on le filtre pour récupérer seulement les fichiers JavaScript.
		var commands = files.filter(file => file.endsWith(".js"))

		if (commands.length > 0)
		{
			// On itére ensuite à travers tous les fichiers pour les ajouter.
			commands.forEach(file => {

				// const command = require(`../commands/${file}`)

				// bot.commands.set(command.name, command)

			})
		}

		// On envoie enfin une notification au Discord de débogage.
		bot.channels.fetch(masterChannel).then(channel => {

			const messageEmbed = new discord.MessageEmbed()
				.setColor(settings.greenColor)
				.setAuthor(bot.user.username, bot.user.avatarURL())
				.setTitle("Chargement des commandes")
				.setDescription(`${commands.length} commandes ont été chargées.`)

			channel.send({ embeds: [ messageEmbed ] });

		})

	})

}
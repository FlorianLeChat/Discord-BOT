//
// Initialisation du bot.
//
const discord = require("discord.js")
const bot = new discord.Client({

	// GUILS + GUID_MEMBERS + GUILD_BANS + GUILD_MESSAGES + DIRECT_MESSAGES
	// https://discord.com/developers/docs/topics/gateway#list-of-intents
	intents: new discord.Intents(4615),

	// https://discordjs.guide/additional-info/changes-in-v13.html#allowed-mentions
	allowedMentions: {
		parse: [
			"users",
			"roles"
		],
		repliedUser: true
	}

})

//
// Lancement du gestionnaire des activités personnalisées.
// Note : 1000 ms => 1 seconde * <temps en secondes> (exemple : 600 secondes = 10 minutes).
//
const delay = 1000 * 600
const { randomActivity } = require("./modules/activity_manager.js")

bot.on("ready", () => {

	randomActivity(bot)

	setInterval(() => {

		randomActivity(bot)

	}, delay)

})

//
// Création des commandes.
//
bot.commands = new discord.Collection()

const { createCommands } = require("./modules/commands_loader.js")

bot.on("ready", () => {

	createCommands(bot)

})

//
// Gestion du chat & exécution des commandes.
//
const { sendMessage } = require("./modules/messages_handler.js")

bot.on("messageCreate", (message) => {

	sendMessage(bot, message)
})

bot.on("messageUpdate", (_, newMessage) => {

	sendMessage(bot, newMessage)

})

//
// Lancement du suivi des comptes Twitter.
//
const { streamTwitter } = require("./modules/twitter_tracker.js")

bot.on("ready", () => {

	streamTwitter(bot)

})

//
// Finalisation de l'initialisation.
//
const settings = require("./data/__internal__.json")

bot.login(settings.discordToken)

bot.on("ready", () => {

	bot.channels.fetch(settings.masterChannel).then(channel => {

		const messageEmbed = new discord.MessageEmbed()
			.setColor(settings.greenColor)
			.setAuthor(bot.user.username, bot.user.avatarURL())
			.setTitle("Démarrage terminé")
			.setDescription(`Le robot « ${bot.user.username} » a démarré avec succès.`)
			.addField("Serveurs présents :", bot.guilds.cache.size.toString());

		channel.send({ embeds: [ messageEmbed ] });

	})

})
// Initialisation du module.
const discord = require("discord.js")

// Initialisation du bot.
const bot = new discord.Client({

	// GUILS + GUID_MEMBERS + GUILD_BANS + GUILD_MESSAGES + DIRECT_MESSAGES
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

// Lancement du gestionnaire des activités personnalisées.
// Note : 1000 ms => 1 seconde * <temps en secondes> (exemple : 600 secondes = 10 minutes).
const delay = 1000 * 600
const { randomActivity } = require("./modules/activity_manager.js")

bot.on("ready", () => {

	randomActivity(bot)

	setInterval(() => {

		randomActivity(bot)

	}, delay)

})

// Lancement du suivi des comptes Twitter.
const {streamTwitter} = require("./modules/twitter_tracker.js")
streamTwitter(bot)

// Finalisation de l'initialisation.
const {discordToken} = require("./data/__internal__.json")

bot.login(discordToken)

bot.on("ready", () => {

	console.log(`Le robot « ${bot.user.username} » a démarré avec succès.`)
	console.log(`Le robot est actuellement connecté sur ${bot.guilds.cache.size} serveurs.`)

})
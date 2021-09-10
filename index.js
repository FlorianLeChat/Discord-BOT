// Initialisation du module.
const discord = require("discord.js");

// Initialisation du bot.
const bot = new discord.Client({

	// GUILS + GUID_MEMBERS + GUILD_BANS + GUILD_MESSAGES + DIRECT_MESSAGES
	intents: new discord.Intents(4615),

	// https://discordjs.guide/additional-info/changes-in-v13.html#allowed-mentions
	allowedMentions: {
		parse: ["users", "roles"],
		repliedUser: true
	}

});

// Lancement du gestionnaire des activités personnalisées.
const {updateActivity} = require("./modules/activity_manager.js");
const delay = 1000 * 600;

bot.on("ready", () =>
{
	console.log(`Le robot \"${bot.user.username}\" a démarré avec succès.`);
	console.log(`Le robot est actuellement connecté sur ${bot.guilds.cache.size} serveurs.`);

	updateActivity(bot);

	// Note : 1000 ms => 1 seconde * <temps en secondes> (ex: 600 secondes = 10 minutes).
	setInterval(() =>
	{
		updateActivity(bot)
	}, delay);
});

// Création des commandes.
// bot.commands = new discord.Collection();

// const {createCommands} = require("./modules/commands_loader.js");
// createCommands(bot);

// Lancement du suivi des comptes Twitter.
const {streamTwitter} = require("./modules/twitter_tracker.js");
streamTwitter(bot);

// Finalisation de l'initialisation.
const {token} = require("./config.json");

bot.login(token);
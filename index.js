// Initialisation du module.
const discord = require("discord.js");

// Initialisation du bot.
const bot = new discord.Client({

	// GUILS + GUID_MEMBERS + GUILD_BANS + GUILD_MESSAGES + DIRECT_MESSAGES
	intents: new discord.Intents(4615),
	// https://discordjs.guide/additional-info/changes-in-v13.html#allowed-mentions
	allowedMentions: { parse: ["users", "roles"], repliedUser: true }

});

// Initialisation des modules.
bot.commands = new discord.Collection();

const commands = require("./modules/commands_loader.js")
commands(bot)

const twitter = require("./modules/twitter_tracker.js")
twitter()
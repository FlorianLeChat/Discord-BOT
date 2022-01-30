//
// Initialisation du bot.
//
const discord = require( "discord.js" );
const bot = new discord.Client( {

	// GUILDS + GUILD_MEMBERS + GUILD_BANS + GUILD_MESSAGES + DIRECT_MESSAGES
	// + GUILD_MESSAGE_REACTIONS
	// https://discord.com/developers/docs/topics/gateway#list-of-intents
	intents: new discord.Intents( 5639 ),

	// https://discordjs.guide/additional-info/changes-in-v13.html#allowed-mentions
	allowedMentions: {
		parse: [
			"everyone",
			"users",
			"roles"
		],
		repliedUser: true
	}

} );

//
// Lancement du gestionnaire des activités personnalisées.
// Note : 1000 ms => 1 seconde * <temps en secondes> (exemple : 600 secondes = 10 minutes).
//
const delay = 1000 * 600;
const { randomActivity } = require( "./modules/activity_manager.js" );

bot.once( "ready", () =>
{
	randomActivity( bot );

	setInterval( () =>
	{
		randomActivity( bot );
	}, delay );
} );

//
// Création des commandes.
//
bot.commands = new discord.Collection();

const { createCommands } = require( "./modules/commands_loader.js" );

bot.once( "ready", () =>
{
	createCommands( bot );
} );

//
// Gestion du chat & exécution des commandes.
//
const { sendMessage } = require( "./modules/messages_handler.js" );

bot.on( "messageCreate", ( message ) =>
{
	sendMessage( bot, message );
} );

bot.on( "messageUpdate", ( _, newMessage ) =>
{
	sendMessage( bot, newMessage );
} );

//
// Lancement du suivi des comptes Twitter.
//
const { streamTwitter } = require( "./modules/twitter_tracker.js" );

bot.once( "ready", () =>
{
	streamTwitter( bot );
} );

//
// Initialisation de la liaison avec la base de données.
// Note : on en profite pour créer la table globale des données.
//
const { query } = require( "./modules/sql_database.js" );

bot.once( "ready", () =>
{
	query( bot, `CREATE TABLE IF NOT EXISTS \`global_data\` (

		\`uniqueID\` INT NOT NULL AUTO_INCREMENT,
		\`userID\` VARCHAR(20) NOT NULL,
		\`name\` VARCHAR(30) NOT NULL,
		\`value\` VARCHAR(255) NOT NULL,
		PRIMARY KEY ( \`uniqueID\` )

	)` );
} );

//
// Exécution de l'événement du "No Nut November".
// Note : fonctionne seulement durant le mois de novembre.
//
const { createMessage, updateCount } = require( "./modules/no_nut_november.js" );

bot.once( "ready", () =>
{
	// On vérifie si nous sommes au mois de novembre.
	let month = new Date().getMonth();

	if ( month != 10 )
		return;

	// On fait ensuite la création du tout premier message ou de son actualisation au démarrage.
	createMessage( bot );

	// On réalise enfin cette tâche tous les soirs à minuit.
	setInterval( () =>
	{
		let timestamp = new Date();
		timestamp = timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();

		if ( timestamp == "0:0:0" )
		{
			createMessage( bot );
		}
	}, 1000 );

} );

bot.on( "messageReactionAdd", ( reaction, user ) =>
{
	updateCount( bot, reaction, user, true );
} );

bot.on( "messageReactionRemove", ( reaction, user ) =>
{
	updateCount( bot, reaction, user, false );
} );

//
// Finalisation de l'initialisation.
//
const settings = require( "./data/__internal__.json" );

bot.login( settings.discordToken );

bot.once( "ready", () =>
{
	bot.channels.fetch( settings.masterChannel ).then( channel =>
	{
		const messageEmbed = new discord.MessageEmbed()
			.setColor( settings.greenColor )
			.setAuthor( { name: bot.user.username, iconURL: bot.user.avatarURL() } )
			.setTitle( "Démarrage terminé" )
			.setDescription( `Le robot « ${ bot.user.username } » a démarré avec succès.` )
			.addField( "Serveurs présents :", bot.guilds.cache.size.toString() );

		channel.send( { embeds: [ messageEmbed ] } )
			.catch( console.error );
	} );
} );

bot.on( "error", ( error ) =>
{
	// Prise en charge des erreurs internes (Discord/Node JS).
	console.error( "Le robot a rencontré une erreur interne :", error );
} );
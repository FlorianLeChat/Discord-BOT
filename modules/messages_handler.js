//
// Gestion des messages/commandes.
//
const discord = require( "discord.js" );
const { masterChannel, redColor } = require( "../data/__internal__.json" );

const prefix = "/";
const cooldowns = new discord.Collection();

module.exports.sendMessage = async ( bot, message ) =>
{
	// On vérifie si la personne a mentionné un robot.
	if ( message.mentions.has( bot.user ) && !message.mentions.everyone )
	{
		message.reply( "Pourquoi mentionner un bot ? :robot:" );
		return;
	}

	// On évite de vérifier les messages du bot ou ceux reçus en messages privés.
	if ( message.author.bot || message.channel.type == "dm" )
		return;

	// On regarde si on doit répondre automatiquement
	let content = message.content.toLowerCase();

	if ( content.startsWith( "bonjour" ) || content.startsWith( "coucou" ) || content.startsWith( "salut" ) )
		return message.reply( "Bonjour à toi, jeune entrepreneur !" );

	// On vérifie si on tente d'utiliser une commande.
	if ( !content.startsWith( prefix ) )
		return;

	// On vérifie si la commande (ou son alias) existe.
	const args = message.content.slice( prefix.length ).trim().split( / +/ );
	const commandName = args.shift().toLowerCase();

	const command = bot.commands.get( commandName ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandName ) );

	if ( !command )
		return;

	// On applique un délai entre chaque exécution de commande.
	// Note : cela s'applique seulement aux non-administrateurs.
	const cooldown = 3000;

	if ( !message.member.hasPermission( "MANAGE_MESSAGES" ) )
	{
		// On vérifie si un temps d'attente est déjà en place.
		if ( !cooldowns.has( command.name ) )
			cooldowns.set( command.name, new discord.Collection() );

		// Dans le cas contraire, on supprime le message en affichant le temps restant.
		const now = Date.now();
		const timestamps = cooldowns.get( command.name );

		if ( timestamps.has( message.author.id ) )
		{
			const expirationTime = timestamps.get( message.author.id ) + cooldown;

			if ( now < expirationTime )
			{
				const timeLeft = ( expirationTime - now ) / 1000;

				message.delete();

				return message.reply( `Vous devez attendre ${ timeLeft.toFixed( 1 ) } secondes entre chaque exécution de commandes.` );
			}
		}

		// On définit enfin une suppression automatique après le temps d'attente écoulé.
		timestamps.set( message.author.id, now );

		setTimeout( () => timestamps.delete( message.author.id ), cooldown );
	}

	// On vérifie ensuite la présence d'arguments nécessaires pour l'exécution de la commande.
	if ( command.args && !args.length || message == "help" )
	{
		let reply = "Des arguments sont nécessaires pour exécuter cette commande.";

		if ( command.usage )
			reply += `\nUtilisation: \`${ prefix }${ command.name } ${ command.usage }\``;

		return message.reply( reply );
	}

	// On exécute enfin (si possible) la commande voulue.
	try
	{
		command.execute( bot, message, args );
	}
	catch ( error )
	{
		// Message d'erreur à l'auteur de la commande.
		message.reply( `Une erreur interne est survenue lors de l'exécution de la commande « ${ command.name } » :\n${ error.message }.` );

		// Notification au serveur de débogage Discord.
		bot.channels.fetch( masterChannel ).then( channel =>
		{
			const messageEmbed = new discord.MessageEmbed()
				.setColor( redColor )
				.setAuthor( { name: bot.user.username, iconURL: bot.user.avatarURL() } )
				.setTitle( "Erreur d'exécution d'une commande" )
				.setDescription( `Une erreur interne est survenue lors de l'exécution de la commande : « ${ command.name } ».` )
				.addField( "Message d'erreur :", error.message );

			channel.send( { embeds: [ messageEmbed ] } )
				.catch( console.error );
		} );
	}
};
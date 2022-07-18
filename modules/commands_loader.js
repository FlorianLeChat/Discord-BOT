//
// Création des commandes personnalisées.
//
const discord = require( "discord.js" );
const fileSystem = require( "fs" );

const settings = require( "../data/__internal__.json" );

module.exports.createCommands = async ( bot ) =>
{
	fileSystem.readdir( "./commands/", async ( error, files ) =>
	{
		// On vérifie s'il n'y a pas une erreur interne avec le système de fichiers.
		// Note : on en profite pour envoyer une notification à un Discord de débogage.
		if ( error )
		{
			bot.channels.fetch( settings.masterChannel ).then( channel =>
			{
				const embedBuilder = new discord.EmbedBuilder()
					.setColor( settings.redColor )
					.setTitle( "Erreur du système de fichiers" )
					.setAuthor( { name: bot.user.username, iconURL: bot.user.avatarURL() } )
					.addFields( { name: "Message d'erreur :", value: error.message } )
					.setDescription( "Une erreur interne s'est produite lors de la récupération des commandes." );

				channel.send( { embeds: [ embedBuilder ] } )
					.catch( console.error );
			} );

			return;
		}

		// On récupère alors le résultat et on le filtre pour récupérer seulement les fichiers JavaScript.
		let commands = files.filter( file => file.endsWith( ".js" ) );

		if ( commands.length > 0 )
		{
			// On itére ensuite à travers tous les fichiers pour les ajouter.
			// for ( const file of commands.values() )
			// {
			// 	const command = require( `../commands/${ file }` );

			// 	bot.commands.set( command.name, command );
			// }
		}

		// On envoie enfin une notification au Discord de débogage.
		bot.channels.fetch( settings.masterChannel ).then( channel =>
		{
			const embedBuilder = new discord.EmbedBuilder()
				.setColor( settings.greenColor )
				.setTitle( "Chargement des commandes" )
				.setAuthor( { name: bot.user.username, iconURL: bot.user.avatarURL() } )
				.setDescription( `${ commands.length } commandes ont été chargées.` );

			channel.send( { embeds: [ embedBuilder ] } )
				.catch( console.error );
		} );
	} );
};
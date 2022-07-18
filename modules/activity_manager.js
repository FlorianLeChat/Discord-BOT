//
// Activités personnalisées du bot.
//
const discord = require( "discord.js" );
const { masterChannel, blueColor } = require( "../data/__internal__.json" );

const activities = [
	"Macron à Marseille / Les Marseillais à L'Elysée ",
	"Attention ! Risque de chute de Karim sur l'aéroport de Kaboul",
	"« Les mots construisent des ponts vers des régions inexplorées » - A. Hitler",
	"Zemmour vs Marine",
	"Talibans Lives Matter",
	"#Zemmour2022",
	"Propriétaire d'un bar gay à La Mecque",
	"Made by FlOwOrian",
	"LGBT is not okay, heterosexuality is natural law"
];

module.exports =
{
	// Définition de l'activité.
	setActivity: ( bot, name, type = "PLAYING" ) =>
	{
		// On définit d'abord l'activité personnalisée.
		bot.user.setActivity( name, {
			type: type
		} );

		// On envoie ensuite une notification dans le canal de débogage.
		bot.channels.fetch( masterChannel ).then( channel =>
		{
			const embedBuilder = new discord.EmbedBuilder()
				.setColor( blueColor )
				.setTitle( "Nouvelle activité" )
				.setAuthor( { name: bot.user.username, iconURL: bot.user.avatarURL() } )
				.setDescription( `« ${ name } ».` );

			channel.send( { embeds: [ embedBuilder ] } )
				.catch( console.error );
		} );
	},

	// Randomisation de l'activité.
	randomActivity: ( bot ) =>
	{
		let index = Math.floor( Math.random() * ( activities.length - 1 ) + 1 );

		module.exports.setActivity( bot, activities[ index ] );
	}
};
//
// Toutes les notifications d'erreurs du bot.
// Note : ce fichier est obsolète est devra être supprimé dans le futur.
//
const discord = require( "discord.js" );
const { red } = require( "../config.json" );

module.exports =
{
	// Erreur lorsqu'un utilisateur réalise une action avec des permissions insuffisantes.
	noPerms: ( message, permission ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "Permissions insuffisantes" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible de faire cette action avec vos permissions actuelles." )
			.setImage( "https://media.giphy.com/media/6Q2KA5ly49368/giphy.gif" )
			.addField( "Permission manquante:", permission );

		message.channel.send( embed )
			.catch( console.error );
	},

	// Erreur lorsque l'auteur d'une commande vise un utilisateur ayant les permissions que lui.
	equalPerms: ( message, _user, permission ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "Permissions égales" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible de faire cette action sur un utilisateur ayant les mêmes permissions que vous." )
			.setImage( "https://media.giphy.com/media/mw8HkELEB4tna/giphy.gif" )
			.addField( "Cet utilisateur a les mêmes permissions que vous:", permission );

		message.channel.send( embed )
			.catch( console.error );
	},

	// Erreur lorsque l'auteur d'une commande vise un bot Discord.
	botUser: ( message ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "MrRobot 1 - 0 Vous" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible de faire cette action sur un robot." )
			.setImage( "https://media.giphy.com/media/sFTWiBKYYWKVa/giphy.gif" );

		message.channel.send( embed )
			.catch( console.error );
	},

	// Erreur lorsque l'auteur d'une commande se vise lui-même.
	sameUser: ( message ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "wtf" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible de faire cette action sur vous-même." )
			.setImage( "https://media.giphy.com/media/pPhyAv5t9V8djyRFJH/giphy.gif" );

		message.channel.send( embed )
			.catch( console.error );
	},

	// Erreur lorsque la recherche d'un utilisateur n'a rien donné ou incomplète.
	cantFindUser: ( message ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "Utilisateur introuvable" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible de trouver l'utilisateur spécifié." )
			.setImage( "https://media.giphy.com/media/j6aoUHK5YiJEc/giphy.gif" );

		message.channel.send( embed )
			.catch( console.error );
	},

	// Erreur lorsqu'une raison n'est pas spécifiée pour certaines actions (kick, ban, etc).
	noReason: ( message ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "Raison manquante" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible spécifier une raison pour votre action." )
			.setImage( "https://media.giphy.com/media/EV0lA5PyzwbDO/giphy.gif" );

		message.channel.send( embed )
			.catch( console.error );
	},

	// Erreur lorsqu'une durée n'a pas été spécifiée pour certaines actions (ban, warning, etc).
	noLength: ( message ) =>
	{
		const embed = new discord.MessageEmbed()
			.setColor( red )
			.setAuthor( { name: message.author.tag, iconURL: message.author.avatarURL() } )
			.setTitle( "Durée manquante" )
			.setThumbnail( message.guild.iconURL() )
			.setDescription( "Il est impossible spécifier une durée (en minutes) pour votre action." )
			.setImage( "https://media.giphy.com/media/9u514UZd57mRhnBCEk/giphy.gif" );

		message.channel.send( embed )
			.catch( console.error );
	}
};
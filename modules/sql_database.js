//
// Enregistrement de données via base de données SQL.
// Source : https://www.npmjs.com/package/mysql
//
const mysql = require( "mysql" );
const discord = require( "discord.js" );
const settings = require( "../data/__internal__.json" );

const connection = mysql.createConnection( {
	host: settings.sqlHost,
	user: settings.sqlUser,
	password: settings.sqlPassword,
	database: settings.sqlDatabase
} );

module.exports =
{
	// Connexion à la base de données.
	connect: () =>
	{
		return new Promise( ( resolve, reject ) =>
		{
			// On vérifie si la base de données n'est pas déjà connectée.
			if ( connection.state == "authenticated" )
			{
				resolve( "La base de données est déjà connectée." );
				return;
			}

			// Dans le cas contraire, on essaie d'établir la connexion.
			connection.connect( ( error ) =>
			{
				// On vérifie si la connexion a réussie.
				if ( error )
				{
					reject( `Impossible de se connecter à la base de données SQL. Code d'erreur : ${ error.code }` );
					return;
				}

				// On créé alors la table des données globales.
				connection.query( `CREATE TABLE IF NOT EXISTS \`global_data\` (

					\`uniqueID\` INT NOT NULL AUTO_INCREMENT,
					\`userID\` VARCHAR(20) NOT NULL,
					\`name\` VARCHAR(30) NOT NULL,
					\`value\` VARCHAR(255) NOT NULL,
					PRIMARY KEY ( \`uniqueID\` )

				)` );

				// On affiche enfin le message de connexion avec l'identifiant associé.
				resolve( `Connexion réussie à la base de données, ID : ${ connection.threadId }.` );
			} );
		} );
	},

	// Définition d'une valeur sauvegardée.
	setSaveData: ( bot, id, name, value ) =>
	{
		return new Promise( async () =>
		{
			// On vérifie si la connexion avec la base de données est déjà établie.
			// Note : on envoie alors une notification dans un Discord de débogage.
			await module.exports.connect()
				.then( message =>
				{
					// Information
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.blueColor )
							.setAuthor( bot.user.username, bot.user.avatarURL() )
							.setTitle( "Informations SQL" )
							.setDescription( message );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );
				} )
				.catch( error =>
				{
					// Erreur
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.redColor )
							.setAuthor( bot.user.username, bot.user.avatarURL() )
							.setTitle( "Erreur SQL" )
							.setDescription( error );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );

					return;
				} );

			// On rend ensuite valide les arguments renseignés.
			id = connection.escape( id );
			name = connection.escape( name );
			value = connection.escape( value );

			// On fait une première requête SQL pour vérifier si une valeur est déjà présente.
			const selectQuery = `
				SELECT \`value\` FROM \`global_data\`
				WHERE \`userID\` = ${ id } AND \`name\` = ${ name }`;

			connection.query( selectQuery, ( error, results ) =>
			{
				// On envoie une notification d'erreur si la requête échoue.
				if ( error )
				{
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.redColor )
							.setAuthor( bot.user.username, bot.user.avatarURL() )
							.setTitle( "Erreur SQL" )
							.setDescription( "Requête lors de la requête SQL." )
							.addField( "Code d'erreur :", error.code );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );

					return;
				}

				// Dans le cas contraire, on vérifie le nombre de résultats.
				if ( results.length <= 0 )
				{
					// Ajout d'une nouvelle entrée.
					connection.query( `
						INSERT INTO \`global_data\` (\`userID\`, \`name\`, \`value\`)
						VALUES (${ id }, ${ name }, ${ value })
					` );
				}
				else
				{
					// Actualisation d'une entrée existante.
					connection.query( `
						UPDATE \`global_data\` SET \`value\` = ${ value }
						WHERE \`userID\` = ${ id } AND \`name\` = ${ name }
					` );
				}
			} );
		} );
	},

	// Récupération d'une valeur sauvegardée.
	getSaveData: ( bot, id, name, fallback ) =>
	{
		return new Promise( async ( resolve ) =>
		{
			// On vérifie si la connexion avec la base de données est déjà établie.
			// Note : on envoie alors une notification dans un Discord de débogage.
			await module.exports.connect()
				.then( message =>
				{
					// Information
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.blueColor )
							.setAuthor( bot.user.username, bot.user.avatarURL() )
							.setTitle( "Informations SQL" )
							.setDescription( message );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );
				} )
				.catch( error =>
				{
					// Erreur
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.redColor )
							.setAuthor( bot.user.username, bot.user.avatarURL() )
							.setTitle( "Erreur SQL" )
							.setDescription( error );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );

					resolve( fallback );

					return;
				} );

			// On rend ensuite valide les arguments renseignés.
			id = connection.escape( id );
			name = connection.escape( name );

			// On effectue enfin une requête pour obtenir la valeur.
			const selectQuery = `
				SELECT \`value\` FROM \`global_data\`
				WHERE \`userID\` = ${ id } AND \`name\` = ${ name }`;

			connection.query( selectQuery, ( error, results ) =>
			{
				// On vérifie si le résultat n'est pas une erreur.
				// Note : on en profite aussi pour envoyer une notification sur un Discord de débogage.
				if ( error )
				{
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.redColor )
							.setAuthor( bot.user.username, bot.user.avatarURL() )
							.setTitle( "Erreur SQL" )
							.setDescription( "Requête lors de la requête SQL." )
							.addField( "Code d'erreur :", error.code );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );

					resolve( fallback );

					return;
				}

				// Dans le cas contraire, on résout la promesse avec les informations retournées.
				resolve( results.length <= 0 && fallback || results[ 0 ].value );
			} );
		} );
	}
};
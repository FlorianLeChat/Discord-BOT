//
// Enregistrement de données via base de données SQL.
// Source : https://www.npmjs.com/package/mysql
//
const mysql = require( "mysql" );
const discord = require( "discord.js" );
const settings = require( "../data/__internal__.json" );

const pool = mysql.createPool( {
	host: settings.sqlHost,
	user: settings.sqlUser,
	password: settings.sqlPassword,
	database: settings.sqlDatabase
} );

module.exports =
{
	// Requête vers la base de données.
	query: ( bot, query ) =>
	{
		return new Promise( ( resolve ) =>
		{
			pool.query( query, function ( error, results )
			{
				// On vérifie si la connexion a réussie.
				if ( error )
				{
					bot.channels.fetch( settings.masterChannel ).then( channel =>
					{
						const messageEmbed = new discord.MessageEmbed()
							.setColor( settings.redColor )
							.setAuthor( { name: bot.user.username, iconURL: bot.user.avatarURL() } )
							.setTitle( "Erreur SQL" )
							.setDescription( "Requête lors de la requête SQL." )
							.addField( "Code d'erreur :", error.code );

						channel.send( { embeds: [ messageEmbed ] } )
							.catch( console.error );
					} );
				};

				// Si c'est le cas, on retourne le résultat.
				resolve( results );
			} );
		} );
	},

	// Définition d'une valeur sauvegardée.
	setSaveData: ( bot, id, name, value ) =>
	{
		return new Promise( async () =>
		{
			// On rend d'abord valide les arguments renseignés.
			id = pool.escape( id );
			name = pool.escape( name );
			value = pool.escape( value );

			// On réalise ensuite une première requête SQL pour vérifier si une valeur est déjà présente.
			const selectQuery = `
				SELECT \`value\` FROM \`global_data\`
				WHERE \`userID\` = ${ id } AND \`name\` = ${ name }`;

			module.exports.query( bot, selectQuery, ( results ) =>
			{
				// On vérifie alors le nombre de résultats.
				if ( results.length <= 0 )
				{
					// Il n'y a pas d'entrée, on en ajoute une nouvelle.
					module.exports.query( bot, `
						INSERT INTO \`global_data\` (\`userID\`, \`name\`, \`value\`)
						VALUES (${ id }, ${ name }, ${ value })
					` );
				}
				else
				{
					// Dans le cas contraire, on actualise l'entrée actuelle.
					module.exports.query( bot, `
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
			// On rend d'abord valide les arguments renseignés.
			id = pool.escape( id );
			name = pool.escape( name );

			// On effectue alors une requête pour obtenir la valeur.
			const selectQuery = `
				SELECT \`value\` FROM \`global_data\`
				WHERE \`userID\` = ${ id } AND \`name\` = ${ name }`;

			module.exports.query( bot, selectQuery ).then( results =>
			{
				resolve( results.length <= 0 ? fallback : results[ 0 ].value );
			} )
		} );
	}
};

pool.on( "error", ( error ) =>
{
	// Prise en charge des erreurs internes (base de données SQL).
	console.error( "La liaison SQL a rencontrée une erreur interne :", error );
} );
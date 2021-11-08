//
// Événement du "No Nut November".
//
const excluders = [];
const { sleep } = require( "../utils/functions.js" );
const { setSaveData, getSaveData } = require( "./sql_database.js" );

let days = 0;

module.exports =
{
	// Création du message d'informations des jours passés.
	createMessage: async ( bot ) =>
	{
		// On recherche tous les serveurs et salons accueillant l'événement.
		// Note : on coupe l'exécution du script si aucun serveur/salon n'est trouvé.
		const cache = bot.channels.cache;

		let guilds = [];
		let channels = [];

		for ( const channel of cache.values() )
		{
			const identifier = channel.guild.id;

			if ( channel.name.includes( "nnn" ) || channel.name.includes( "no-nut-november" ) )
			{
				if ( !guilds.includes( identifier ) )
					guilds.push( identifier ); // On ajoute l'identifiant du serveur seulement une seule fois.

				channels.push( channel.id );
			}
		}

		days = new Date().getDate(); // Mise à jour du nombre de jours.

		if ( guilds.length <= 0 || channels.length <= 0 )
			return;

		// On créé par la suite le message d'information grâce aux informations récupérées précédemment.
		// Note : une solution plus simple serait de faire cette étape dans la précédente boucle, sans succès...
		let users = [];
		let phrase = `:spy: :sweat_drops: Statut « **No Nut November** » (Jour ${ days }) :\n`;
		phrase += "\n:point_right: Pour prendre en compte votre présence, réagissez à ce message !\n";

		for ( const identifier of guilds.values() )
		{
			const guild = bot.guilds.cache.get( identifier );

			guild.members.fetch().then( async ( members ) =>
			{
				// On itére à travers tous les membres de chaque serveur.
				for ( const member of members.values() )
				{
					// On exclut tous les robots.
					if ( member.user.bot )
						continue;

					// On exclut les utilisateurs qui ne peuvent pas participer.
					let identifier = member.user.id;

					if ( excluders.includes( identifier ) )
						continue;

					// Dans le cas contraire, on récupère les informations de l'utilisateur concernant l'événement.
					await getSaveData( bot, identifier, "NNN", 0 ).then( result =>
					{
						if ( result > 0 && !users.includes( identifier ) ) // Pas besoin d'afficher les utilisateurs qui ne participent pas.
						{
							phrase += `- __${ member.user.username }__ : J+${ result }\n`;
							users.push( identifier );
						}
					} );
				};
			} );
		}

		phrase += "\n:rotating_light: **Les valeurs ci-dessous sont actualisées tous les jours à minuit.** :rotating_light:\n\n";

		await sleep( 3000 ); // Attente nécessaire pour la base de données.

		// On itére après à travers tous les salons en mémoire.
		for ( const identifier of channels.values() )
		{
			bot.channels.fetch( identifier ).then( channel =>
			{
				// On récupère ensuite un certain nombre de messages provenant du canal.
				// Note : on limite la recherche des messages à un nombre de 10 pour éviter d'aller trop loin.
				let edited = false;

				channel.messages.fetch( { limit: 10 } ).then( messages =>
				{
					// On vérifie alors si l'un des messages parle de l'événement et qu'il a été créé par le bot.
					for ( const message of messages.values() )
					{
						if ( message.author.id == bot.user.id && message.content.includes( "No Nut November" ) )
						{
							// Si c'est le cas, on arrête la recherche et on édite le message actuel.
							edited = true;

							message.edit( phrase );
							message.reactions.removeAll()
								.catch( console.error );

							break;
						}
					}

					// Dans le cas contraire, on envoie un nouveau message.
					if ( !edited )
					{
						channel.send( phrase )
							.catch( console.error );
					}

					// On envoie enfin (si nécessaire) un @everyone pour prévenir que le message à été mis à jour.
					channel.send( "@everyone" )
						.then( message => setTimeout( () => message.delete(), 100 ) )
						.catch( console.error );
				} );
			} );
		}
	},

	// Compteur interne du nombre de jours passés.
	updateCount: async ( bot, reaction, user, type ) =>
	{
		// On vérifie si ce n'est pas le bot qui ajoute une réaction et/ou s'il ne s'agit pas du message actuel.
		if ( reaction.message.author.id != "468066164036206602" || !reaction.message.content.includes( "No Nut November" ) )
			return;

		// On vérifie ensuite la liste des utilisateurs exclus de l'événement.
		if ( excluders.includes( user.id ) )
			return;

		// On enregistre enfin le nombre de jours passés dans la base de données.
		var count = days;

		if ( type === true )
			count++;

		setSaveData( bot, user.id, "NNN", count );
	}
};
//
// Événement du "No Nut November".
//
const excluders = [];
const { setSaveData } = require( "./sql_database.js" );

let days = new Date().getDate() - 1;
let users = [];

module.exports = {

	// Création du message d'informations des jours passés.
	createMessage: ( bot ) => {

		// On recherche tous les canaux de l'événement avant d'afficher ou d'éditer le message.
		// Note : on coupe l'exécution du script si aucun salon n'est trouvé.
		let cache = bot.channels.cache;
		let channels = [];

		days++;

		for ( const channel of cache.values() )
		{
			if ( channel.name.includes( "nnn" ) || channel.name.includes( "no-nut-november" ) )
			{
				channels.push( channel.id );
			}
		};

		if ( channels.length <= 0 )
			return;

		// On créé le message d'information.
		let phrase = `:spy: :sweat_drops: Statut « **No Nut November** » (Jour ${ days }) :\n`;
		phrase += "\n:point_right: Pour prendre en compte votre présence, réagissez à ce message !\n";

		for ( let identifier in users )
		{
			const user = bot.users.cache.get( identifier );

			// On exclut tous les robots.
			if ( user.bot )
				return;

			// On exclut les utilisateurs qui ne peuvent pas participer.
			if ( excluders.includes( user.id ) )
				return;

			phrase += `- __${ user.username }__ : J+${ users[user.id] || 0 }\n`;
		};

		phrase += "\n**Ces valeurs sont actualisées tous les jours à minuit.** :point_up_2:";

		// On itére à travers tous les salons en mémoire.
		for ( const identifier of channels.values() )
		{
			bot.channels.fetch( identifier ).then( channel => {

				// On récupère un certain nombre de messages provenant du canal.
				// Note : on limite la recherche des messages à un nombre de 10 pour éviter d'aller trop loin.
				let edited = false;

				channel.messages.fetch( { limit: 10 } ).then( messages => {

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

					};

					// Dans le cas contraire, on envoie ensuite un nouveau message.
					if ( !edited )
					{
						channel.send( phrase )
							.catch( console.error );
					}

					// On envoie enfin un @everyone fantôme pour prévenir que le message à été mis à jour.
					channel.send( "@everyone" )
						.then( message => setTimeout( () => message.delete(), 100 ) )
						.catch( console.error );

				} )

			} );
		};

	},

	// Compteur interne du nombre de jours passés.
	updateCount: async ( bot, reaction, user, type ) => {

		// On vérifie si ce n'est pas le bot qui ajoute une réaction et/ou s'il ne s'agit pas du message actuel.
		if ( reaction.message.author.id != "468066164036206602" || !reaction.message.content.includes( "No Nut November" ) )
			return;

		// On vérifie ensuite la liste des utilisateurs exclus de l'événement.
		if ( excluders.includes( user.id ) )
			return;

		// On vérifie alors si on doit incrémenter une journée ou non à l'utilisateur.
		users[user.id] = days;

		if ( type == true )
		{
			// On évite le spam des réactions pour briser la logique de l'événement.
			if ( users[user.id] >= days + 1 )
				return;

			users[user.id]++;
		}

		// On sauvegarde enfin cette information dans la base de données.
		setSaveData( bot, user.id, "NNN", users[user.id] );

	}

}
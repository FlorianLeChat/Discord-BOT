//
// Événement du "No Nut November".
//
const settings = require( "../data/__internal__.json" );
const excluders = [];

let days = 1;
let users = [];
let message;

module.exports = {

	// Création du message d'informations des jours passés.
	createMessage: () => {

		// On recherche tous les canaux de l'événement avant d'afficher ou d'éditer le message.
		// Note : on coupe l'exécution du script si aucun salon n'est trouvé.
		let channels = [];

		bot.channels.cache.forEach( channel => {

			if ( channel.name.includes( "nnn" ) || channel.name.includes( "no-nut-november" ) )
			{
				channels.push( channel.id );
			}

		} );

		if ( channels.length <= 0 )
			return;

		// On créé alors le message d'informations.
		let phrase = `:spy: :sweat_drops: Statut « **No Nuts November** » (Jour ${ days }) :\n`;
		phrase += "\n:point_right: Pour prendre en compte votre présence, réagissez à ce message !\n";

		users.forEach( identifier => {

			const member = bot.users.cache.get( identifier );

			// On exclut tous les robots.
			if ( member.user.bot )
				continue;

			// On exclut les utilisateurs qui ne peuvent pas participer.
			if ( excluders.includes( member.user.id ) )
				return;

			phrase += `- __${ member.user.username }__ : J+${ users[member.id] || 0 }\n`;

		} );

		phrase += "\n**Ces valeurs sont actualisées tous les jours à minuit.** :point_up_2:";

		// On vérifie enfin si le message est encore présent pour effectuer certaines actions.
		if ( message )
		{
			// On édite le message et on supprime toutes les réactions existantes.
			message.edit( phrase );
			message.reactions.removeAll()
				.catch( console.error );
		}
		else
		{
			// On itére à travers tous les salons en mémoire pour envoyer le message.
			channels.forEach( identifier => {

				bot.channels.fetch( identifier ).then( channel => {

					channel.send( phrase );

				} );

			} );
		}

	},

	// Compteur interne du nombre de jours passés.
	updateCount: async ( bot, reaction, user, type ) => {

		// On vérifie si ce n'est pas le bot qui ajoute une réaction et/ou s'il ne s'agit pas du message actuel.
		if ( reaction.message.author.id != "468066164036206602" || !reaction.message.content.includes( "No Nuts November" ) )
			return;

		// On vérifie la liste des utilisateurs exclus de l'événement.
		if ( excluders.includes( user.id ) )
			return;

		// On récupère ensuite (si possible) les données actuelles pour prendre les plus anciennes.
		let current = await getSaveData( bot, user.id, "NNN", days );

		users[user.id] = Math.min( current, days );

		// On vérifie alors si on doit incrémenter une journée ou non à l'utilisateur.
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
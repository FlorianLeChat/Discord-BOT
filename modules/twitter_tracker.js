//
// Suivi de certaines actualités Twitter.
// Source : https://www.npmjs.com/package/twitter-api-v2
//
const { ETwitterStreamEvent, TwitterApi } = require( "twitter-api-v2" );
const { twitterToken, redColor, orangeColor } = require( "../data/__internal__.json" );

module.exports.streamTwitter = async ( bot ) => {

	// On récupère tous les canaux pour envoyer les messages d'actualités.
	// Note : ce service est désactivé si aucun salon est trouvé.
	let channels = [];

	bot.channels.cache.forEach( channel => {

		if ( channel.name.includes( "news" ) || channel.name.includes( "actualités" ) )
		{
			channels.push( channel.id );
		}

	} );

	if ( channels.length <= 0 )
		return;

	// On initialise le module de l'API Twitter.
	const client = new TwitterApi( twitterToken );

	// On récupère les règles de filtrage actuelles avant de les supprimer.
	const rules = await client.v2.streamRules();

	if ( rules.data?.length )
	{
		await client.v2.updateStreamRules( {
			delete: {
				ids: rules.data.map( rule => rule.id )
			}
		} );
	}

	// On ajoute les comptes à suivre pour l'affichage des nouveaux tweets.
	await client.v2.updateStreamRules( {
		add: [
			{ value: "from:217749896" }, 			// Marine <3
			{ value: "from:338985020" }, 			// AFP (FR)
			{ value: "from:24744541" }, 			// Le Monde (FR)
			{ value: "from:1001029225476972545" }, 	// Ministère de l'intérieur (FR)
			{ value: "from:2097571" }, 				// CNN International (US)
			{ value: "from:742143" }, 				// BBC World (UK)
			{ value: "from:19897138" },				// India Today (IND)
			{ value: "from:56644534" }, 			// CCTV (CHN)
			{ value: "from:64643056" } 				// RT (RUS)
		]
	} );

	// On lance la recherche des tweets en indiquant les données que l'API doit nous retourner.
	const stream = await client.v2.searchStream( {
		"tweet.fields": ["author_id"]
	} );

	stream.autoReconnect = true;

	stream.on( ETwitterStreamEvent.Data, async ( eventInfo ) => {

		// On vérifie que le tweet n'est pas un RT.
		if ( eventInfo.data.text.startsWith( "RT @" ) )
			return;

		// On vérifie alors la nationalité du compte.
		let countryFlag = ":flag_fr:";

		switch ( eventInfo.data.author_id )
		{
			case "2097571": // CNN
				countryFlag = ":flag_us:";
				break;
			case "742143": // BBC
				countryFlag = ":flag_gb:";
				break;
			case "19897138": // India Today
				countryFlag = ":flag_in:";
				break;
			case "56644534": // CCTV
				countryFlag = ":flag_cn:";
				break;
			case "64643056": // RT
				countryFlag = ":flag_ru:";
				break;
			case "1001029225476972545": // Ministère de l'Intérieur
				countryFlag = ":rotating_light: @everyone";
				break;
		}

		// On envoie ensuite le message dans les canaux récupérés précédemment.
		let userInfo = await client.v2.user( eventInfo.data.author_id );

		channels.forEach( identifier => {

			bot.channels.fetch( identifier ).then( channel => {

				channel.send( `https://twitter.com/${ userInfo.data.username }/status/${ eventInfo.data.id } ${ countryFlag }` );

			} );

		} );

	} );

	// On affiche une notification dans tous les canaux d'actualités si une erreur de connexion se produit.
	const username = bot.user.username;
	const avatar = bot.user.avatarURL();

	stream.on( ETwitterStreamEvent.ConnectionError, error =>

		channels.forEach( identifier => {

			bot.channels.fetch( identifier ).then( channel => {

				const messageEmbed = new discord.MessageEmbed()
					.setColor( orangeColor )
					.setAuthor( username, avatar )
					.setTitle( "Erreur API" )
					.setDescription( "Une erreur de connexion s'est produite avec les serveurs Twitter." )
					.addField( "Message d'erreur :", error.message );

				channel.send( { embeds: [messageEmbed] } );

			} );

		} )

	);

	// On affiche une notification dans tous les canaux d'actualités si la connexion se perd.
	stream.on( ETwitterStreamEvent.ConnectionClosed, () =>

		channels.forEach( identifier => {

			bot.channels.fetch( identifier ).then( channel => {

				const messageEmbed = new discord.MessageEmbed()
					.setColor( redColor )
					.setAuthor( username, avatar )
					.setTitle( "Erreur API" )
					.setDescription( "La connexion entre le robot et les serveurs Twitter a été interrompue." );

				channel.send( { embeds: [messageEmbed] } );

			} );

		} )

	);

};
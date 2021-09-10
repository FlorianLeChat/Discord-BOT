//
// Suivi de certains comptes Twitter.
// Source : https://www.npmjs.com/package/twitter-api-v2
//
const {bearerToken, twitterChannel} = require("../config.json");
const {ETwitterStreamEvent, TwitterApi} = require("twitter-api-v2");

module.exports.streamTwitter = async(bot) => {

	// On initialise le module de l'API Twitter.
	const client = new TwitterApi(bearerToken);

	// On récupère les règles de filtrage actuelles avant de les supprimer.
	const rules = await client.v2.streamRules();

	if (rules.data?.length) {
		await client.v2.updateStreamRules({
			delete: {
				ids: rules.data.map(rule => rule.id)
			}
		});
	}

	// On ajoute les comptes à suivre pour l'affichage des nouveaux tweets.
	await client.v2.updateStreamRules({
		add: [
			{ value: "from:133663801"},
			{ value: "from:217749896" }, 			// Marine <3
			{ value: "from:338985020" }, 			// AFP (FR)
			{ value: "from:24744541" }, 			// Le Monde (FR)
			{ value: "from:1001029225476972545" }, 	// Ministère de l'intérieur (FR)
			{ value: "from:2097571" }, 				// CNN International (US)
			{ value: "from:742143" }, 				// BBC World (UK)
		],
	});

	// On lance la recherche des tweets en indiquant les données que l'API doit nous retourner.
	const stream = await client.v2.searchStream({
		"tweet.fields": [
			"author_id"
		]
	});

	stream.autoReconnect = true;
	stream.on(ETwitterStreamEvent.Data, async(eventInfo) =>
	{
		// On vérifie que le tweet n'est pas un RT.
		if (eventInfo.data.text.startsWith("RT @"))
			return;

		// On vérifie alors la nationalité du compte.
		var countryFlag = ":flag_fr:";

		switch (eventInfo.data.author_id)
		{
			case "2097571": // CNN
				countryFlag = ":flag_us:";
				break;
			case "742143": // BBC
				countryFlag = ":flag_gb:";
				break;
			case "1001029225476972545": // Ministère de l'Intérieur
				countryFlag = ":rotating_light: @everyone";
				break;
			case "217749896": // Marine <3
				countryFlag += " <@183272411167326209> <@407212462740340747>";
				break;
		};

		// On envoie ensuite le message dans le canal prévu à cet effet.
		var userInfo = await client.v2.user(eventInfo.data.author_id)

		bot.channels.fetch(twitterChannel)
			.then(channel =>
				channel.send(`https://twitter.com/${userInfo.data.username}/status/${eventInfo.data.id} ${countryFlag}`)
			)
			.catch(error =>
				console.log(`[Error] Impossible de trouver le salon pour répliquer les messages Twitter, ${error}.`)
			);
	});

	//
	stream.on(ETwitterStreamEvent.ConnectionError, error =>
		console.log("Connection error!", error),
	);

	stream.on(ETwitterStreamEvent.ConnectionClosed, () =>
		console.log("Connection has been closed."),
	);

};
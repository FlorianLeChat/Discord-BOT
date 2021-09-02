//
// Suivi de certains comptes Twitter.
// Source : https://www.npmjs.com/package/twitter-api-v2
//
const { ETwitterStreamEvent, TwitterApi } = require("twitter-api-v2");
const follows = [
	"217749896", // Marine <3
	"338985020", // AFP (FR)
	"24744541", // Le Monde (FR)
	"1001029225476972545", // Ministère de l'Intérieur (FR)
	"2097571", // CNN International (US)
	"742143", // BBC World (UK)
];

const client = new TwitterApi("AAAAAAAAAAAAAAAAAAAAAP5bGgEAAAAAPDuTdl2h3Xj7ubiikeroSP%2BEXc8%3D0j5zi1Nw71BDZAif6CXMyq6eldvXW8XzKn63TXgP4IXpo5KkDo")
const twitter = async() => {

	const rules = await client.v2.streamRules();
	if (rules.data?.length) {
		await client.v2.updateStreamRules({
			delete: { ids: rules.data.map(rule => rule.id) },
		});
	}

	// Add our rules
	await client.v2.updateStreamRules({
		add: [{ value: 'JavaScript' }, { value: 'NodeJS' }],
	});


	await client.v2.filterStream({
		track: "RT -filter:retweets",
		follow: follows
	});

	const stream = await client.v2.searchStream({
		'tweet.fields': ['referenced_tweets', 'author_id'],
		expansions: ['referenced_tweets.id'],
	});

	stream.autoReconnect = true;

	stream.on(ETwitterStreamEvent.ConnectionError, error =>
		console.log("Connection error!", error),
	);

	stream.on(ETwitterStreamEvent.ConnectionClosed, () =>
		console.log("Connection has been closed."),
	);

	stream.on(ETwitterStreamEvent.Data, eventData =>
		console.log("Twitter has sent something:", eventData),
	);

	stream.on(ETwitterStreamEvent.DataKeepAlive, () =>
		console.log('Twitter has a keep-alive packet.'),
	);

}

module.exports = twitter


// stream.on("tweet", function(tweet) {
// 	// On vérifie si l'identifiant du compte est l'un des comptes suivis.
// 	if (!follows.includes(tweet.user.id_str))
// 		return;

// 	// On vérifie alors la nationalité du compte.
// 	var countryFlag = ":flag_fr:";

// 	switch (tweet.user.id_str)
// 	{
// 		case "2097571": // CNN
// 			countryFlag = ":flag_us:";
// 			break;
// 		case "742143": // BBC
// 			countryFlag = ":flag_gb:";
// 			break;
// 		case "1001029225476972545": // Ministère de l'Intérieur
// 			countryFlag = ":rotating_light: @everyone";
// 			break;
// 		case "217749896": // Marine
// 			countryFlag += " <@183272411167326209> <@407212462740340747>";
// 			break;
// 	};

// 	// On envoie finalement le message.
// 	bot.channels.fetch("740960089195937873")
// 		.then(channel =>
// 			channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str} ${countryFlag}`)
// 		)
// 		.catch(error =>
// 			console.log(`[Error] Impossible de trouver le salon pour répliquer les messages Twitter, message ${error}.`)
// 		);
// });
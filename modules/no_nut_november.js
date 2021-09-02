//
// Spécialité du "No Nuts November".
//
const excluders = []
let users = JSON.parse(fileSystem.readFileSync("./nnn.json", "utf8"));
let days = 1;
let message;

const createMessage = async() => {
	let phrase = `:spy: :sweat_drops: Statut « **No Nuts November** » (Jour ${days}) :\n`;

	phrase += "\n:point_right: Pour prendre en compte votre présence, réagissez à ce message !\n";

	bot.guilds.cache.get("473298739558350850").members.cache.forEach(member => {
		if (member.user.bot)
			return;

		if (excluders.includes(member.user.id))
			return;

		phrase += `- __${member.user.username}__ : J+${users[member.id] || 0}\n`;
	});

	phrase += "\n**Ces valeurs sont actualisées tous les jours à minuit.** :point_up_2:";

	if (message) {
		message.edit(phrase);
		message.reactions.removeAll()
			.catch(console.error);
	}
	else
	{
		message = await bot.channels.cache.get("772443354679869470").send(phrase);
	};
};

const updateCount = async(reaction, user, type) => {
	if (reaction.message.author.id != "468066164036206602" || !reaction.message.content.includes("No Nuts November"))
		return;

	if (excluders.includes(user.id))
		return;

	users[user.id] = days;

	if (type == true)
	{
		if (users[user.id] >= days + 1)
			return;

		users[user.id]++;
	}

	fileSystem.writeFile("./nnn.json", JSON.stringify(users), console.error);
};

bot.on("messageReactionAdd", async(reaction, user) => {
	updateCount(reaction, user, true)
});

bot.on("messageReactionRemove", async(reaction, user) => {
	updateCount(reaction, user, false)
});
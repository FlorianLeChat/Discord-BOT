const errors = require("../utils/errors.js");
const moment = require("moment");

module.exports = {
	name: "relay",
	description: "[STEAM] Permet de relayer les messages d'une conversation Steam vers Discord.",
	execute(bot, message, _args) {
		if (!message.member.id == "183272411167326209")
			return errors.noPerms(message, "PRIVATE");

		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		message.delete();

		// let listedChannels = [];

		// message.guild.channels.cache.forEach(channel => {
		// 	console.log(channel);
		// 	listedChannels.push(channel.name, channel.id);
		// });

		// message.author.send(`Salons trouvés:\n\n${listedChannels.join("\n")}`);

		const target = bot.channels.cache.get("693825903087714374");

		if (!target || target.type == "voice")
			return console.log("Salon indisponible.");

		let history = "";

		target.messages.fetch({limit : 100}).then(async messages => {
			console.log(`Nombre de messages: ${messages.size}.`);

			let finalArray = [];

			const putInArray = async(data) => {
				finalArray.push(data);
			}

			for (const message of messages.array().reverse())
				await putInArray(`(${moment(message.createdTimestamp).format("H:mm.ss DD-MM-YYYY")}) ${message.author.username} : ${message.content}`);

			console.log(finalArray)
			console.log(finalArray.length)
		});
	},
};
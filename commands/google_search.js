module.exports = {
	name: "search",
	description: "[GOOGLE] Permet de faire une recherche sur internet avec le moteur de recherche Google !",
	usage: "<Objet de votre recherche>",
	aliases: ["google"],
	args: true,
	execute(_bot, message, args) {
		let request = message.content.split(" ");
		request.shift();

		message.reply(`https://www.google.fr/#q=${request.join("%20")}`);
	},
};
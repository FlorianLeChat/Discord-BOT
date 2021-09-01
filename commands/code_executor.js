const discord = require("discord.js");
const request = require("superagent");
const { green } = require("../config.json");

const languages = {
	"c++": "1",
	"lua": "14"
};

module.exports = {
	name: "executor",
	description: "[BOT] Permet d'exécuter du code ou un script pour n'importe quel langage.",
	usage: "<Langage de programmation> <Code ou script a exécuter>",
	aliases: ["exec", "run"],
	args: true,
	execute(_bot, message, args) {
		if (!message.guild.available)
			return message.reply("Une erreur interne est survenue. Les services Discord sont peut-être indisponibles.");

		let language = args[0];

		if (!language)
			return message.reply("Veuillez renseigner un langage de programmation.");

		const langID = languages[language.toLowerCase().trim()];

		if (!langID)
			return message.reply("Veuillez renseigner un langage de programmation valide : \"Lua\" ou \"C++\".");

		let code = args.splice(1);
		code = code.join(" ");

		if (!code)
			return message.reply("Veuillez renseigner du code a exécuter.");

		request
		.post("https://rextester.com/rundotnet/api")
		.send({ LanguageChoice: langID, Program: code })
		.end((error, result) => {
			message.delete();

			if (error)
			{
				message.reply(`Une erreur est survenue lors de la compilation du code: ${error}.`)
			}
			else
			{
				const data = JSON.parse(result.text);
				let text = ""

				if (data.Warnings != null)
					text += `Avertissement: \`${data.Warnings}\``;

				if (data.Errors != null)
					text += `Erreur d'exécution: \`${data.Errors}\``;

				if (data.Result != null)
					text += `Résultat: \`${data.Result}\``;

				const embed = new discord.MessageEmbed()
				.setColor(green)
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setTitle("Compilation de code")
				.setURL("https://rextester.com/")
				.setThumbnail(message.guild.iconURL())
				.addField("Code:", `\`\`\`${language}\n${code}\`\`\``)
				.addField("Sortie:", text)
				.setFooter(data.Stats);

				message.channel.send(embed);
			}
		});
	},
};
const request = require("request");
const iso = require("iso-639-1");
const queryString = require("querystring");

module.exports = {
	name: "translate",
	description: "[GOOGLE] Permet de faire une traduction de votre phrase dans la langue que vous voulez Google Traduction !\n(Pour les codes ISO, voici les codes de tous les pays du monde : https://fr.wikipedia.org/wiki/ISO_3166-1).",
	usage: "<Code ISO 3166-1 de la langue que vous voulez traduire votre phrase> <Phrase à traduire>",
	aliases: ["trans", "translation"],
	args: true,
	execute(_bot, message, args) {
		const languageCode = iso.getCode(args[0]) || args[0];

		let phrase = args.splice(1); // On supprime le code ISO de la phrase à traduire.
		phrase = phrase.join(" "); // On transforme le tableau en chaîne de caractère.
		phrase = queryString.escape(phrase); // On supprime les caractères qui pourraient provoquer des erreurs dans la requête.

		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${languageCode}"&dt=t&q=${phrase}`;

		request(url, function(error, _response, body) {
			if (error)
			{
				message.reply("Erreur lors de la traduction du texte.");
			}
			else
			{
				// Voir ci-dessous pour magie noire.
				let translated = body.match(/^\[\[\[".+?",/)[0];
				translated = translated.substring(4, translated.length - 2);
				message.reply(`Traduction: ${translated}`);
			}
		});
	},
};
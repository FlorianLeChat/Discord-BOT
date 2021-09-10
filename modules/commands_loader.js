//
// Création des commandes personnalisées.
//
const fileSystem = require("fs");
const createCommands = async(bot) => {

	fileSystem.readdir("./commands/", async(error, files) => {

		// On vérifie s'il n'y a pas une erreur interne avec le système de fichiers;
		if (error)
		{
			console.log("[Erreur] Une erreur interne s'est produite lors de la récupération des scripts.", error);
			return;
		}

		// On récupère alors le résultat et on le filtre pour récupérer seulement les fichiers JavaScript.
		var commands = files.filter(file => file.endsWith(".js"));

		if (commands.length <= 0)
		{
			console.log("[Erreur] Aucune commande est actuellement disponible.");
			return;
		}

		// On itére enfin à travers tous les fichiers pour les ajouter.
		commands.forEach(file => {
			const command = require(`../commands/${file}`);

			console.log(`[Info] Le fichier ${file} a été chargé.`);

			bot.commands.set(command.name, command);
		});

		console.log(`[Info] ${commands.length} fichiers ont été chargés.`);

	});

}

module.exports = createCommands
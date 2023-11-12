// Importation du normalisateur TypeScript.
import "@total-typescript/ts-reset";

// Importation des dépendances.
import * as dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

// Importation des fichiers utilitaires.
import { registerEvents } from "./utilities/events_loader";
import { loadCommands, registerCommands } from "./utilities/commands_loader";

// Configuration des variables d'environnement.
dotenv.config();
dotenv.config( { path: ".env.local", override: true } );

// Création de l'instance du robot.
const client = new Client( { intents: [ GatewayIntentBits.Guilds ] } );


// Création des événements personnalisés.
( async () =>
{
	console.log( 2 );
	console.log( "[INFO] Début du chargement des événements personnalisés." );

	registerEvents( client );

	console.log( "[INFO] Fin de chargement des événements personnalisés." );
} )();

// Création des commandes interactives.
( async () =>
{
	// Chargement des commandes interactives depuis le système de fichiers.
	console.log( "[INFO] Début du chargement des commandes interactives." );

	client.slashCommands = await loadCommands();

	console.log(
		`[INFO] Fin de chargement des ${ client.slashCommands.size } commandes interactives.`
	);

	// Enregistrement des commandes interactives auprès de Discord.
	console.log(
		`[INFO] Début de l'enregistrement de ${ client.slashCommands.size } commandes.`
	);

	await registerCommands(
		client.slashCommands.map( ( command ) => command.command )
	);

	console.log( "[INFO] Fin de l'enregistrement des commandes interactives." );
} )();

// Authentification et connexion du robot.
client.login( process.env.BOT_TOKEN );
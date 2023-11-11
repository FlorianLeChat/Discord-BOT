// Importation du normalisateur TypeScript.
import "@total-typescript/ts-reset";

// Importation des dépendances.
import * as dotenv from "dotenv";
import { Events, Client, GatewayIntentBits } from "discord.js";

// Importation des fichiers utilitaires.
import { loadCommands, registerCommands } from "./utilities/commands_loader";

// Configuration des variables d'environnement.
dotenv.config();
dotenv.config( { path: ".env.local", override: true } );

// Création des applications.
const client = new Client( { intents: [ GatewayIntentBits.Guilds ] } );

client.once( Events.ClientReady, ( c ) =>
{
	console.log( `Ready! Logged in as ${ c.user.tag }` );
} );

// Création des commandes interactives.
( async () =>
{
	// On charge les commandes interactives à partir des fichiers
	//  présents dans le dossier dédié.
	console.log( "[INFO] Début du chargement des commandes interactives." );

	client.slashCommands = await loadCommands();

	console.log(
		`[INFO] Fin de chargement des ${ client.slashCommands.size } commandes interactives.`
	);

	// On réalise ensuite leur enregistrement auprès de Discord.
	console.log(
		`[INFO] Début de l'enregistrement de ${ client.slashCommands.size } commandes.`
	);

	await registerCommands(
		client.slashCommands.map( ( command ) => command.command )
	);

	console.log( "[INFO] Fin de l'enregistrement des commandes interactives." );

	// On ajoute enfin un gestionnaire d'évènements pour les commandes
	client.on( Events.InteractionCreate, async ( interaction ) =>
	{
		// Vérification que l'interaction est bien une commande.
		if ( !interaction.isChatInputCommand() ) return;

		// Récupération de la commande.
		const command = interaction.client.slashCommands.get(
			interaction.commandName
		);

		if ( !command )
		{
			// Message d'erreur en cas de commande inconnue.
			console.error(
				`No command matching ${ interaction.commandName } was found.`
			);

			return;
		}

		try
		{
			// Exécution de la commande.
			await command.execute( interaction );
		}
		catch ( error )
		{
			// Message d'erreur en cas d'erreur d'exécution.
			console.error( error );

			if ( interaction.replied || interaction.deferred )
			{
				await interaction.followUp( {
					content: "There was an error while executing this command!",
					ephemeral: true
				} );
			}
			else
			{
				await interaction.reply( {
					content: "There was an error while executing this command!",
					ephemeral: true
				} );
			}
		}
	} );
} )();

// Authentification et connexion du robot.
client.login( process.env.BOT_TOKEN );
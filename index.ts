// Importation du normalisateur TypeScript.
import "@total-typescript/ts-reset";

// Importation des dépendances.
import {
	Client, Collection, Events, GatewayIntentBits
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import * as dotenv from "dotenv";
import { pathToFileURL } from "url";

// Configuration des variables d'environnement.
dotenv.config();
dotenv.config( { path: ".env.local", override: true } );

// Création des applications.
const client = new Client( { intents: [ GatewayIntentBits.Guilds ] } );

client.once( Events.ClientReady, ( c ) =>
{
	console.log( `Ready! Logged in as ${ c.user.tag }` );
} );

// Chargement des commandes interactives.
client.commands = new Collection();

const foldersPath = path.join( __dirname, "commands" );
console.log( foldersPath );
const folders = fs.readdirSync( foldersPath );

folders.forEach( ( folder ) =>
{
	const pathname = path.join( foldersPath, folder );
	const files = fs
		.readdirSync( pathname )
		.filter( ( file ) => file.endsWith( ".js" ) );

	files.forEach( async ( file ) =>
	{
		const filePath = path.join( pathname, file );
		const command = await import( pathToFileURL( filePath ).href );

		console.log( command );

		if ( "data" in command && "execute" in command )
		{
			client.commands.set( command.data.name, command );
		}
		else
		{
			console.log(
				`[WARNING] The command at ${ filePath } is missing a required "data" or "execute" property.`
			);
		}
	} );
} );

// Exécution des commandes interactives.
client.on( Events.InteractionCreate, async ( interaction ) =>
{
	if ( !interaction.isChatInputCommand() ) return;

	const command = interaction.client.commands.get(
		interaction.commandName
	) as {
		execute: ( interaction: unknown ) => Promise<void>;
	};

	if ( !command )
	{
		console.error(
			`No command matching ${ interaction.commandName } was found.`
		);

		return;
	}

	try
	{
		await command.execute( interaction );
	}
	catch ( error )
	{
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

// Authentification et connexion du robot.
client.login( process.env.BOT_TOKEN );
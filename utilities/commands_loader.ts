// Importation des dépendance.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { REST, Routes, Collection } from "discord.js";

// Importation des types.
import type { SlashCommand } from "../@types/discord";

//
// Chargement de l'ensemble des commandes interactives.
//
const directory = path.join( __dirname, "../commands" );
const folders = fs.readdirSync( directory );

export async function loadCommands(): Promise<
	Collection<string, SlashCommand>
	>
{
	const promises = [] as Promise<void>[];
	const commands = new Collection<string, SlashCommand>();

	folders.forEach( async ( folder ) =>
	{
		const pathname = path.join( directory, folder );
		const files = fs
			.readdirSync( pathname )
			.filter( ( file ) => file.endsWith( ".js" ) );

		files.forEach( async ( file ) =>
		{
			promises.push(
				new Promise<void>( ( resolve ) =>
				{
					const filePath = path.join( pathname, file );

					import( pathToFileURL( filePath ).href ).then( ( command ) =>
					{
						if ( "data" in command && "execute" in command )
						{
							commands.set( command.data.name, {
								command: command.data,
								execute: command.execute
							} );

							console.log(
								`[INFO] Chargement de la commande ${ command.data.name }, située à ${ filePath }.`
							);
						}
						else
						{
							console.log(
								`[ERREUR] Échec du chargement de la commande située à ${ filePath }.`
							);
						}

						resolve();
					} );
				} )
			);
		} );
	} );

	await Promise.all( promises );

	return commands;
}

//
// Enregistrement des commandes interactives.
//
export async function registerCommands(
	commands: Collection<string, SlashCommand>
): Promise<void>
{
	// On créé d'abord une instance de l'API REST.
	const rest = new REST().setToken( process.env.BOT_TOKEN ?? "" );

	try
	{
		// On effectue alors une requête pour enregistrer les commandes
		// interactives auprès de l'API Discord.
		const data = ( await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID ?? "",
				process.env.GUILD_ID ?? ""
			),
			{ body: commands }
		) ) as unknown as unknown[];

		console.log(
			`[INFO] Enregistrement de ${ data.length } commandes terminé.`
		);
	}
	catch ( error )
	{
		// En cas d'erreur, on affiche enfin un message d'erreur.
		console.error( error );
	}
}
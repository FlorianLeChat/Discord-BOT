// Importation des dépendances.
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
	// On créé d'abord une promesse pour chaque fichier de commande
	//  afin de les stocker dans un tableau.
	const promises = [] as Promise<void>[];
	const commands = new Collection<string, SlashCommand>();

	// On parcourt ensuite chaque dossier de commandes.
	folders.forEach( async ( folder ) =>
	{
		// On récupère alors le chemin du dossier et la liste des fichiers
		//  qu'il contient afin de les parcourir.
		const pathname = path.join( directory, folder );
		const files = fs
			.readdirSync( pathname )
			.filter( ( file ) => file.endsWith( ".js" ) );

		files.forEach( async ( file ) =>
		{
			// On créé ensuite une promesse pour chaque fichier de commande
			//  afin de les traiter en même temps plus tard.
			promises.push(
				new Promise<void>( ( resolve ) =>
				{
					const filePath = path.join( pathname, file );

					import( pathToFileURL( filePath ).href ).then( ( module ) =>
					{
						// On vérifie que le fichier contient bien une commande
						//  interactive et on l'ajoute à la collection.
						if (
							"command" in module.data
							&& "execute" in module.data
						)
						{
							commands.set( module.data.command.name, {
								...module.data
							} );

							console.log(
								`[INFO] Chargement de la commande ${ module.data.command.name }, située à ${ filePath }.`
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

	// On attend enfin que toutes les promesses soient résolues
	//  et on retourne la collection de commandes.
	await Promise.all( promises );

	return commands;
}

//
// Enregistrement des commandes interactives.
//
export async function registerCommands(
	commands: SlashCommand["command"][]
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
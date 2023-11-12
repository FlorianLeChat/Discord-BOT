// Importation des dépendances
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";

// Importation des types.
import type { Client } from "discord.js";
import type { BotEvent } from "../@types/discord";

//
// Enregistrement des événements personnalisés.
//
const directory = path.join( __dirname, "../events" );
const files = fs.readdirSync( directory ).filter( ( file ) => file.endsWith( ".js" ) );

export function registerEvents( client: Client ): void
{
	// On parcourt d'abord chaque fichier d'événement.
	files.forEach( async ( file ) =>
	{
		const filePath = path.join( directory, file );
		const event = Object.values(
			( await import( pathToFileURL( filePath ).href ) ).default
		)[ 0 ] as BotEvent;

		// On vérifie enfin si l'événement doit être exécuté une seule fois
		//  ou non afin de l'enregistrer correctement.
		if ( event.once )
		{
			client.once( event.name, ( ...args ) => event.execute( ...args ) );

			console.log(
				`[INFO] Chargement de l'événement unique ${ event.name }, situé à ${ filePath }.`
			);
		}
		else
		{
			client.on( event.name, ( ...args ) => event.execute( ...args ) );

			console.log(
				`[INFO] Chargement de l'événement ${ event.name }, situé à ${ filePath }.`
			);
		}
	} );
}
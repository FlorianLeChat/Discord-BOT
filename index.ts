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

// Authentification et connexion du robot.
client.login( process.env.BOT_TOKEN );
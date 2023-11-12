//
// Événement de démarrage du robot.
//
import { Events } from "discord.js";
import type { BotEvent } from "../@types/discord";

export const ready: BotEvent = {
	name: Events.ClientReady,
	once: true,
	execute( client )
	{
		console.log( `Ready! Logged in as ${ client.user.tag }` );
	}
};
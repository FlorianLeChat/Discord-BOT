//
// Commande de réponse automatique à une commande.
//
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../@types/discord";

export const data: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName( "ping" )
		.setDescription( "Replies with Pong!" ),
	execute: ( interaction ) => interaction.reply( "Pong!" )
};
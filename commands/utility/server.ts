//
// Commande d'affichage des informations du serveur Discord.
//
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../@types/discord";

export const data: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName( "server" )
		.setDescription( "Display info about this server." ),
	execute: ( interaction ) => interaction.reply(
		`Server name: ${ interaction.guild?.name }\nTotal members: ${ interaction.guild?.memberCount }`
	)
};
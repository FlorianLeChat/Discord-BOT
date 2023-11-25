//
// Commande d'affichage des informations d'un utilisateur.
//
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../@types/discord";

export const data: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName( "user" )
		.setDescription( "Provides information about the user." ),
	execute: ( interaction ) => interaction.reply(
		`This command was run by ${ interaction.user.username }, who joined on ${ interaction.member?.joinedAt }.`
	)
};
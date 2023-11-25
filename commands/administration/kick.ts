//
// Commande d'expulsion d'un utilisateur du serveur Discord.
//
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../@types/discord";

export const data: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName( "kick" )
		.setDescription( "Select a member and kick them (but not really)." )
		.addUserOption( ( option ) => option
			.setName( "target" )
			.setDescription( "The member to kick" )
			.setRequired( true ) ),
	execute: ( interaction ) =>
	{
		const member = interaction.options.getMember( "target" );

		return interaction.reply( {
			content: `You wanted to kick: ${ member?.user.username }`,
			ephemeral: true
		} );
	}
};
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
		const user = interaction.options.getUser( "target" );

		if ( !user )
		{
			return interaction.reply( {
				content: "No user has been selected.",
				ephemeral: true
			} );
		}

		return interaction.reply( {
			content: `You wanted to kick: ${ user.username }`,
			ephemeral: true
		} );
	}
};
//
// Commande de suppression d'un ou plusieurs messages.
//
import { ChannelType, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../@types/discord";

export const data: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName( "prune" )
		.setDescription( "Prune up to 99 messages." )
		.addIntegerOption( ( option ) => option
			.setName( "amount" )
			.setDescription( "Number of messages to prune" ) ),
	execute: async ( interaction ) =>
	{
		const amount = interaction.options.getInteger( "amount" ) ?? 0;

		if ( amount < 1 || amount > 99 )
		{
			return interaction.reply( {
				content: "You need to input a number between 1 and 99.",
				ephemeral: true
			} );
		}

		if ( interaction.channel?.type !== ChannelType.GuildText )
		{
			return interaction.reply( {
				content: "Only text channels are supported.",
				ephemeral: true
			} );
		}

		await interaction.channel?.bulkDelete( amount, true ).catch( ( error ) =>
		{
			console.error( error );

			interaction.reply( {
				content:
					"There was an error trying to prune messages in this channel!",
				ephemeral: true
			} );
		} );

		return interaction.reply( {
			content: `Successfully pruned \`${ amount }\` messages.`,
			ephemeral: true
		} );
	}
};
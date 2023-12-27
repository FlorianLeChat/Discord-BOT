//
// Commande de récupération de l'URL de l'avatar d'un utilisateur.
//
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../@types/discord";

export const data: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName( "avatar" )
		.setDescription(
			"Get the avatar URL of the selected user, or your own avatar."
		)
		.addUserOption( ( option ) => option
			.setName( "target" )
			.setDescription( "The user's avatar to show" ) ),
	execute: ( interaction ) =>
	{
		const user = interaction.options.getUser( "target" );

		if ( !user )
		{
			return interaction.reply(
				`Your avatar: ${ interaction.user.displayAvatarURL() }`
			);
		}

		return interaction.reply(
			`${ user.username }'s avatar: ${ user.displayAvatarURL() }`
		);
	}
};
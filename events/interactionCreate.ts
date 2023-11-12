//
// Événement de démarrage du robot.
//
import { Events } from "discord.js";
import type { BotEvent } from "../@types/discord";

export const interactionCreate: BotEvent = {
	name: Events.InteractionCreate,
	async execute( interaction )
	{
		// Vérification que l'interaction est bien une commande.
		if ( !interaction.isChatInputCommand() ) return;

		// Récupération de la commande.
		const command = interaction.client.slashCommands.get(
			interaction.commandName
		);

		if ( !command )
		{
			// Message d'erreur en cas de commande inconnue.
			console.error(
				`No command matching ${ interaction.commandName } was found.`
			);

			return;
		}

		try
		{
			// Exécution de la commande.
			await command.execute( interaction );
		}
		catch ( error )
		{
			// Message d'erreur en cas d'erreur d'exécution.
			console.error( error );

			if ( interaction.replied || interaction.deferred )
			{
				await interaction.followUp( {
					content: "There was an error while executing this command!",
					ephemeral: true
				} );
			}
			else
			{
				await interaction.reply( {
					content: "There was an error while executing this command!",
					ephemeral: true
				} );
			}
		}
	}
};
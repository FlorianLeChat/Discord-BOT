//
// Événement de démarrage du robot.
//
import { Collection, Events } from "discord.js";
import type { BotEvent, SlashCommand } from "../@types/discord";

// Délai d'attente par défaut.
const DEFAULT_COOLDOWN = 3;

export const interactionCreate: BotEvent = {
	name: Events.InteractionCreate,
	async execute( interaction )
	{
		// On vérifie d'abord que l'interaction est bien une commande.
		if ( !interaction.isChatInputCommand() ) return;

		// On tente de récupérer ensuite la commande.
		const data = interaction.client.slashCommands.get(
			interaction.commandName
		) as SlashCommand;

		if ( !data )
		{
			// Si la commande n'existe pas, on affiche un message d'erreur.
			interaction.reply( {
				content: `Aucune commande correspondant à ${ interaction.commandName } n'a été trouvée.`,
				ephemeral: true
			} );

			return;
		}

		// On récupère après le cache des délais d'attente.
		const { cooldowns } = interaction.client;
		const { command } = data;

		if ( !cooldowns.has( command.name ) )
		{
			// Si la commande ne possède pas de délai d'attente, on en créé un.
			cooldowns.set( command.name, new Collection() );
		}

		// Dans le cas contraire, on vérifie l'état du cache.
		const now = Date.now();
		const cache = cooldowns.get( command.name );
		const amount = ( data.cooldown ?? DEFAULT_COOLDOWN ) * 1_000;

		if ( cache.has( interaction.user.id ) )
		{
			// Si l'utilisateur a déjà utilisé la commande, on vérifie
			//  si le délai d'attente est écoulé.
			const expiration = cache.get( interaction.user.id ) + amount;

			if ( now < expiration )
			{
				// Si le délai d'attente n'est pas écoulé, on affiche un message
				//  d'erreur.
				interaction.reply( {
					content: `Veuillez patienter avant de réutiliser la commande \`${
						command.name
					}\`. Vous pourrez l'utiliser de nouveau dans <t:${ Math.round(
						expiration / 1000
					) }:R>.`,
					ephemeral: true
				} );

				return;
			}
		}

		// Si le délai d'attente est écoulé, on met à jour le cache.
		cache.set( interaction.user.id, now );

		setTimeout( () => cache.delete( interaction.user.id ), amount );

		try
		{
			// On exécute alors la commande.
			await data.execute( interaction );
		}
		catch ( error )
		{
			// En cas d'erreur, on affiche enfin un message d'erreur.
			console.error( error );

			if ( interaction.replied || interaction.deferred )
			{
				await interaction.followUp( {
					content:
						"Une erreur interne est survenue lors de l'exécution de la commande.",
					ephemeral: true
				} );
			}
			else
			{
				await interaction.reply( {
					content:
						"Une erreur interne est survenue lors de l'exécution de la commande.",
					ephemeral: true
				} );
			}
		}
	}
};
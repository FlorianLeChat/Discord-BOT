// Typage de certains objets de DiscordJS (commandes, temps d'attente, etc.).
//  Source : https://github.com/MericcaN41/discordjs-v14-template-ts/blob/74e9dcd06b3e0aeeaa0c4b09db4ba06e7cf363c1/src/types.d.ts
import type {
	Message,
	CacheType,
	Collection,
	ButtonInteraction,
	SlashCommandBuilder,
	PermissionResolvable,
	ModalSubmitInteraction,
	AutocompleteInteraction,
	ChatInputCommandInteraction
} from "discord.js";

export interface BotEvent {
	// Évènements du bot.
	name: string;
	once?: boolean | false;
	execute: ( ...args ) => void;
}

export interface Command {
	// Commandes de chat.
	name: string;
	aliases: Array<string>;
	execute: ( message: Message, args: Array<string> ) => void;
	cooldown?: number;
	permissions: Array<PermissionResolvable>;
}

export interface SlashCommand {
	// Commandes interactives.
	modal?: ( interaction: ModalSubmitInteraction<CacheType> ) => void;
	button?: ( interaction: ButtonInteraction ) => void;
	command: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: ( interaction: ChatInputCommandInteraction ) => void;
	cooldown?: number;
	autocomplete?: ( interaction: AutocompleteInteraction ) => void;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		cooldowns: Collection<string, number>;
		slashCommands: Collection<string, SlashCommand>;
	}
}
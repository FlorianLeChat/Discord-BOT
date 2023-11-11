// Typage de certains objets de DiscordJS (commandes, temps d'attente, etc.).
//  Source : https://github.com/MericcaN41/discordjs-v14-template-ts/blob/main/src/types.d.ts
import type {
	Message,
	CacheType,
	Collection,
	SlashCommandBuilder,
	PermissionResolvable,
	ModalSubmitInteraction,
	AutocompleteInteraction,
	ChatInputCommandInteraction
} from "discord.js";

export interface Command {
	name: string;
	aliases: Array<string>;
	execute: ( message: Message, args: Array<string> ) => void;
	cooldown?: number;
	permissions: Array<PermissionResolvable>;
}

export interface SlashCommand {
	modal?: ( interaction: ModalSubmitInteraction<CacheType> ) => void;
	command: SlashCommandBuilder;
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
// Types d'extensions des propriétés du client DiscordJS.
import { type Collection } from "discord.js";

declare module "discord.js" {
	interface Client {
		commands: Collection<string, unknown>;
	}
}
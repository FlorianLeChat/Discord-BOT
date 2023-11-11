import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName( "server" )
	.setDescription( "Display info about this server." );

export async function execute( interaction )
{
	return interaction.reply(
		`Server name: ${ interaction.guild.name }\nTotal members: ${ interaction.guild.memberCount }`
	);
}
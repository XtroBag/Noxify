import Logger from "./Logger";
import { client } from "../../index";
import { hasCooldown, isAllowedCommand } from "./handleCommands";
import { CommandTypes, ContextMenuCommandModule, SlashCommandModule } from "../types/Command";
import { getCommandNotAllowedEmbed, getCommandOnCooldownEmbed } from "../../config";
import { AutocompleteInteraction, CommandInteraction, ContextMenuCommandInteraction, Interaction } from "discord.js";
import { DiscordClient } from "./DiscordClient";

export async function handleInteractionCommands(client: DiscordClient, interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) await handleCommand(CommandTypes.SlashCommand, client, interaction);
    else if (interaction.isContextMenuCommand()) await handleCommand(CommandTypes.ContextMenu, client, interaction);
    else if (interaction.isAutocomplete()) await handleAutocomplete(interaction);
}

async function handleCommand(
    type: CommandTypes.SlashCommand | CommandTypes.ContextMenu,
    client: DiscordClient,
    interaction: CommandInteraction | ContextMenuCommandInteraction
): Promise<void> {
    const commandModule: SlashCommandModule | ContextMenuCommandModule | undefined = client.commands[type].get(interaction.commandName);
    if (!commandModule) {
        return Logger.error(`No command matching ${interaction.commandName} was found.`);
    }

    const cooldown: boolean | number = hasCooldown(interaction.user.id, commandModule.data.name, commandModule.cooldown);
    if (typeof cooldown === "number") {
        await interaction.reply({
            embeds: [getCommandOnCooldownEmbed(cooldown, commandModule.data.name)],
            ephemeral: true
        });
        return;
    }

    if (
        !isAllowedCommand(commandModule, interaction.user, interaction.guild, interaction.channel, interaction.member)
    ) {
        await interaction.reply({
            embeds: [getCommandNotAllowedEmbed(interaction as Interaction)],
            ephemeral: true
        });
        return;
    }

    try {
        await commandModule.execute(client, interaction as any, client.db);
    } catch (err) {
        return Logger.error(`Error executing ${interaction.commandName}`, err);
    }
}

async function handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const command: SlashCommandModule | undefined = client.commands.slash.get(interaction.commandName);
    if (!command) {
        return Logger.error(`No command matching ${interaction.commandName} was found.`);
    }

    if (!command.autocomplete) {
        return Logger.error(`No autocomplete in ${interaction.commandName} was found.`)
    }

    try {
        await command.autocomplete(interaction, client.db);
    } catch (err) {
        return Logger.error(`Error autocompleting ${interaction.commandName}`, err);
    }
}
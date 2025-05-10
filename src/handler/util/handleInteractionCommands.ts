import Logger from "./Logger";
import { hasCooldown, isAllowedCommand } from "./HandleCommands";
import {
  CommandTypes,
  ContextMenuCommandModule,
  SlashCommandModule,
} from "../types/Command";
import {
  getCommandNotAllowedEmbed,
  getCommandOnCooldownEmbed,
} from "../../config";
import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Interaction,
} from "discord.js";
import { DiscordClient } from "./DiscordClient";
import { Server } from "../schemas/models/Models";

export async function handleInteractionCommands(
  client: DiscordClient,
  interaction: Interaction
) {
  if (interaction.isChatInputCommand()) {
    await handleCommand(
      CommandTypes.SlashCommand,
      client,
      interaction as ChatInputCommandInteraction<"cached">
    );
  } else if (interaction.isContextMenuCommand()) {
    await handleCommand(
      CommandTypes.ContextMenu,
      client,
      interaction as ContextMenuCommandInteraction<"cached">
    );
  } else if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction as AutocompleteInteraction, client);
  }

  async function handleCommand(
    type: CommandTypes.SlashCommand | CommandTypes.ContextMenu,
    client: DiscordClient,
    interaction:
      | ChatInputCommandInteraction<"cached">
      | ContextMenuCommandInteraction<"cached">
  ) {
    try {
      // Only attempt to check/create a server document if the interaction is in a guild
      if (interaction.guild && interaction.guildId) {
        const existingGuild = await Server.findOne({
          guildID: interaction.guildId,
        });
    
        if (!existingGuild) {
          await Server.create({
            name: interaction.guild.name,
            guildID: interaction.guildId,
          });
    
          Logger.log(
            `Created new server document for Guild ID: ${interaction.guildId}`
          );
        }
      } else /* If interaction was used in private DM/Other */  {
        Logger.debug("Interaction is not in a guild. Skipping guild DB check.");
      }
    } catch (DatabaseError) {
      Logger.error(
        `Database error while checking/creating guild document:`,
        DatabaseError
      );
    }

    const commandModule = client.commands[type].get(interaction.commandName);
    if (!commandModule) {
      return Logger.error(
        `No command matching ${interaction.commandName} was found.`
      );
    }

    const cooldown: boolean | number = hasCooldown(
      interaction.user.id,
      commandModule.data.name,
      commandModule.cooldown
    );
    if (typeof cooldown === "number") {
      await interaction.reply({
        embeds: [getCommandOnCooldownEmbed(cooldown, commandModule.data.name)],
        ephemeral: true,
      });
      return;
    }

    if (
      !isAllowedCommand(
        commandModule,
        interaction.user,
        interaction.guild,
        interaction.channel,
        interaction.member
      )
    ) {
      await interaction.reply({
        embeds: [getCommandNotAllowedEmbed(interaction)],
        ephemeral: true,
      });
      return;
    }

    try {
      if (type === CommandTypes.SlashCommand) {
        await (commandModule as SlashCommandModule).execute({
          client,
          interaction: interaction as ChatInputCommandInteraction<"cached">,
        });
      } else if (type === CommandTypes.ContextMenu) {
        await (commandModule as ContextMenuCommandModule).execute({
          client,
          interaction: interaction as ContextMenuCommandInteraction<"cached">,
        });
      }
    } catch (err) {
      Logger.error(`Error executing ${interaction.commandName}`, err);
    }
  }

  async function handleAutocomplete(
    interaction: AutocompleteInteraction,
    client: DiscordClient
  ): Promise<void> {
    const command = client.commands.slash.get(interaction.commandName);
    if (!command) {
      return Logger.error(
        `No command matching ${interaction.commandName} was found.`
      );
    }

    if (!command.autocomplete) {
      return Logger.error(
        `No autocomplete in ${interaction.commandName} was found.`
      );
    }

    try {
      await command.autocomplete(interaction, client);
    } catch (err) {
      Logger.error(`Error autocompleting ${interaction.commandName}`, err);
    }
  }
}

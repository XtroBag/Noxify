import { client } from "../../index";
import { Message } from "discord.js";
import { hasCooldown, isAllowedCommand } from "./HandleCommands";
import { getCommandOnCooldownEmbed, defaultPrefix } from "../../config";
import {
  CommandTypes,
  MessageCommandModule,
  PingCommandModule,
  PrefixCommandModule,
} from "../types/Command";
import { Server } from "../schemas/models/Models";

export async function handleMessageCommands(message: Message): Promise<void> {
  if (!client.user || !message.guild) return;

  const guildSettings = await Server.findOne({ guildID: message.guildId });

  const guildPrefix =
    guildSettings && guildSettings.prefix
      ? guildSettings.prefix
      : defaultPrefix;

  if (message.content.startsWith(guildPrefix)) {
    await handleCommand(CommandTypes.PrefixCommand, message, guildPrefix);
  } else if (message.content.startsWith(`<@${client.user.id}>`)) {
    await handleCommand(CommandTypes.PingCommand, message, guildPrefix);
  } else {
    await handleCommand(CommandTypes.MessageCommand, message, guildPrefix);
  }
}

async function handleCommand(
  type:
    | CommandTypes.PrefixCommand
    | CommandTypes.PingCommand
    | CommandTypes.MessageCommand,
  message: Message,
  guildPrefix: string
): Promise<void> {
  if (!client.user) return;
  let commandName: string = "";
  let args: string[] = [];

  // Generate args based on the command type
  if (type === CommandTypes.PrefixCommand) {
    // Remove the prefix and extract the command name
    const contentWithoutPrefix = message.content
      .slice(guildPrefix.length)
      .trim();
    const spaceIndex = contentWithoutPrefix.indexOf(" "); // Find where the command name ends

    // Extract command name and the rest of the arguments
    if (spaceIndex === -1) {
      commandName = contentWithoutPrefix; // Only command name, no args
    } else {
      commandName = contentWithoutPrefix.slice(0, spaceIndex); // Command name
      args = contentWithoutPrefix.slice(spaceIndex).trim().split(/\s+/); // Arguments after command name
    }
  } else if (type === CommandTypes.PingCommand) {
    // Split the message content by spaces and get the command part
    const commandParts = message.content.split(" ");
    // Safely get commandName and remove spaces
    commandName = commandParts[1]?.replace(/ /g, "") || "";

    // Use a dynamic RegExp to match the bot mention and command name, accounting for possible spaces
    const botMentionPattern = new RegExp(
      `<@!?${client.user.id}>\\s*${commandName}\\s*`,
      "g"
    );

    // Remove the bot mention and command from the message content
    message.content = message.content.replace(botMentionPattern, "");

    // Get the arguments from the remaining message content
    args = message.content.trim().split(/\s+/); // Split by whitespace to capture all arguments
  } else if (type === CommandTypes.MessageCommand) {
    // For message commands, command name is the first word
    commandName = message.content.split(" ")[0];

    // Generate the arguments (everything after command name)
    args = message.content.replace(commandName, "").trim().split(/\s+/);
  }

  // Get the command module based on the command name
  let commandModule:
    | PrefixCommandModule
    | PingCommandModule
    | MessageCommandModule
    | string
    | undefined =
    client.commands[type].get(commandName) ||
    client.commands.aliases[type].get(commandName);

  if (typeof commandModule === "string")
    commandModule = client.commands[type].get(commandModule);

  if (commandModule) {
    // Check if the member has the required permissions
    if (
      commandModule.permissions &&
      !hasPermissions(message.member, commandModule.permissions)
    ) {
      return;
    }

    // Check for cooldown
    const cooldown: number | boolean = hasCooldown(
      message.author.id,
      commandModule.name,
      commandModule.cooldown
    );
    if (typeof cooldown === "number") {
      await message.reply({
        embeds: [getCommandOnCooldownEmbed(cooldown, commandModule.name)],
      });
      return;
    }

    // Check if the command is allowed
    if (
      !(await isAllowedCommand(
        commandModule,
        message.member?.user,
        message.guild,
        message.channel,
        message.member
      ))
    ) {
      // Pass 'client', 'message', 'args', and 'db' in a single object to the execute method
      await commandModule.execute({ client, message, args });
    }
  }
}

function hasPermissions(member: any, permissions: string[]): boolean {
  return permissions.every((permission) => member.permissions.has(permission));
}

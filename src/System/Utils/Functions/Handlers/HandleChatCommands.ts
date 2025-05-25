import { client } from "../../../../index.js";
import { Message } from "discord.js";
import { hasCooldown, isAllowedCommand } from "./HandleCommands.js";
import { Server } from "../../../Schemas/Models/Models.js";
import { defaultPrefix, getCommandOnCooldownEmbed } from "../../../../config.js";
import { CommandTypes, PrefixCommandModule, PingCommandModule, MessageCommandModule } from "../../../Types/Command.js";

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

  if (type === CommandTypes.PrefixCommand) {
    const contentWithoutPrefix = message.content
      .slice(guildPrefix.length)
      .trim();
    const spaceIndex = contentWithoutPrefix.indexOf(" ");

    if (spaceIndex === -1) {
      commandName = contentWithoutPrefix;
    } else {
      commandName = contentWithoutPrefix.slice(0, spaceIndex);
      args = contentWithoutPrefix.slice(spaceIndex).trim().split(/\s+/);
    }
  } else if (type === CommandTypes.PingCommand) {
    const commandParts = message.content.split(" ");
    commandName = commandParts[1]?.replace(/ /g, "") || "";

    const botMentionPattern = new RegExp(
      `<@!?${client.user.id}>\\s*${commandName}\\s*`,
      "g"
    );

    message.content = message.content.replace(botMentionPattern, "");

    args = message.content.trim().split(/\s+/);
  } else if (type === CommandTypes.MessageCommand) {
    commandName = message.content.split(" ")[0];

    args = message.content.replace(commandName, "").trim().split(/\s+/);
  }

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
    if (
      commandModule.permissions &&
      !hasPermissions(message.member, commandModule.permissions)
    ) {
      return;
    }


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

    if (
      !(await isAllowedCommand(
        commandModule,
        message.member?.user,
        message.guild,
        message.channel,
        message.member
      ))
    ) {
      await commandModule.execute({ client, message, args });
    }
  }
}

function hasPermissions(member: any, permissions: string[]): boolean {
  return permissions.every((permission) => member.permissions.has(permission));
}

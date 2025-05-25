import { glob } from "glob";
import Logger from "./Logger.js";
import { client } from "../../../../index.js";
import { DiscordClient } from "./DiscordClient.js";
import { commandsFolderName, ownerId } from "../../../../config.js";
import {
  CommandModule,
  CommandTypes,
  RegisterTypes,
} from "../../../Types/Command.js";
import {
  APIInteractionGuildMember,
  ApplicationCommandType,
  Channel,
  Collection,
  Guild,
  GuildMember,
  REST,
  Routes,
  TextChannel,
  User,
} from "discord.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function registerCommands(client: DiscordClient): Promise<void> {
  await getCommandModules(client);
}

async function getCommandModules(client: DiscordClient): Promise<void> {
  const commandPaths: string[] = await glob(
    `dist/${commandsFolderName}/**/**/*.js`
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  for (const commandPath of commandPaths) {
    const absolutePath = path.resolve(commandPath);
    const relativePath = path
      .relative(__dirname, absolutePath)
      .replace(/\\/g, "/");

    const importPath = `./${relativePath}`;

    try {
      const module: CommandModule = (await import(importPath)).default;

      if (
        module.type === CommandTypes.SlashCommand &&
        (!module.data.name || !module.data.description)
      ) {
        return Logger.issue(
          `No name or description for command at ${importPath} set.`
        );
      }

      if (module.disabled) {
        continue;
      }

      if (module.type === CommandTypes.SlashCommand)
        client.commands[module.type].set(module.data.name, module);
      else if (module.type === CommandTypes.ContextMenu)
        client.commands[module.type].set(module.data.name, module);
      else if (module.type === CommandTypes.PrefixCommand)
        client.commands[module.type].set(module.name, module);
      else if (module.type === CommandTypes.MessageCommand)
        client.commands[module.type].set(module.name, module);
      else if (module.type === CommandTypes.PingCommand)
        client.commands[module.type].set(module.name, module);

      if (
        (module.type === CommandTypes.PrefixCommand ||
          module.type === CommandTypes.MessageCommand ||
          module.type === CommandTypes.PingCommand) &&
        module.aliases
      ) {
        for (const alias of module.aliases) {
          client.commands.aliases[module.type].set(alias, module.name);
        }
      }
    } catch (err) {
      Logger.error(`Failed to load command at ${importPath}`, err);
    }

    if (client.commands.slash.size > 100) {
      Logger.warn("You can only register 100 Slash Commands.");
      process.exit();
    }

    if (
      client.commands.context.filter(
        (command) => command.data.type === ApplicationCommandType.Message
      ).size > 5
    ) {
      Logger.warn("You can only register 5 Message Context Menus.");
      process.exit();
    }

    if (
      client.commands.context.filter(
        (command) => command.data.type === ApplicationCommandType.User
      ).size > 5
    ) {
      Logger.warn("You can only register 5 Message User Menus.");
      process.exit();
    }
  }
}

export async function deleteCommands(
  commandIds: string[],
  type: RegisterTypes
): Promise<void> {
  if (!process.env.CLIENT_ID) {
    return Logger.error("No process.env.CLIENT_ID set!");
  }

  if (RegisterTypes.Guild && !process.env.GUILD_ID) {
    return Logger.error("No process.env.GUILD_ID set!");
  }

  const rest: REST = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN
  );
  const route =
    type === RegisterTypes.Guild
      ? Routes.applicationGuildCommand(
          process.env.CLIENT_ID,
          process.env.GUILD_ID || "",
          ""
        )
      : Routes.applicationCommand(process.env.CLIENT_ID, "");

  for (const commandId of commandIds) {
    await rest
      .delete(`${route}${commandId}`)
      .then(() =>
        Logger.log(
          `Successfully deleted ${type === RegisterTypes.Guild ? "guild" : "global"} command: ${commandId}`
        )
      )
      .catch(console.error);
  }
}

export async function deleteAllCommands(type: RegisterTypes): Promise<void> {
  if (!process.env.CLIENT_ID) {
    Logger.error("No process.env.CLIENT_ID set!");
    return;
  }

  if (type === RegisterTypes.Guild && !process.env.GUILD_ID) {
    Logger.error("No process.env.GUILD_ID set!");
    return;
  }

  const rest: REST = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN
  );
  const route =
    type === RegisterTypes.Guild
      ? Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID || ""
        )
      : Routes.applicationCommands(process.env.CLIENT_ID);

  try {
    await rest.put(route, { body: [] });
    Logger.log(
      `Successfully deleted all ${type === RegisterTypes.Guild ? "guild" : "global"} commands`
    );
  } catch (err) {
    Logger.error(
      `Error deleting ${type === RegisterTypes.Guild ? "guild" : "global"} commands`,
      err
    );
  }
}

export async function isAllowedCommand(
  command: any,
  user: User | undefined,
  guild: Guild | null,
  channel: Channel | null,
  member: GuildMember | APIInteractionGuildMember | null
): Promise<boolean> {
  if (!user || !member) return false;
  const memberRoles: any = member.roles;

  return (
    (command.ownerOnly && user.id !== ownerId) ||
    (command.userWhitelist && !command.userWhitelist.includes(user.id)) ||
    (command.userBlacklist && command.userBlacklist.includes(user.id)) ||
    (command.channelWhitelist &&
      channel &&
      !command.channelWhitelist.includes(channel.id)) ||
    (command.channelBlacklist &&
      channel &&
      command.channelBlacklist.includes(channel.id)) ||
    (command.guildWhitelist &&
      guild &&
      !command.guildWhitelist.includes(guild.id)) ||
    (command.guildBlacklist &&
      guild &&
      command.guildBlacklist.includes(guild.id)) ||
    (command.roleWhitelist &&
      !command.roleWhitelist.some((roleId: string) =>
        memberRoles.cache.has(roleId)
      )) ||
    (command.roleBlacklist &&
      command.roleBlacklist.some((roleId: string) =>
        memberRoles.cache.has(roleId)
      )) ||
    (command.nsfw && channel && !(channel as TextChannel).nsfw)
  );
}

export function hasCooldown(
  userId: string,
  commandName: string,
  cooldown: number | undefined
): boolean | number {
  if (!cooldown) return true;

  const currentTimestamp: number = Math.floor(Date.now() / 1000);
  let commandCollection: Collection<string, number> =
    client.cooldowns.user.get(commandName) || new Collection<string, number>();
  client.cooldowns.user.set(commandName, commandCollection);

  const userCooldown: number | undefined = commandCollection.get(userId);
  if (userCooldown && currentTimestamp < userCooldown) {
    return userCooldown - currentTimestamp;
  }

  commandCollection.set(userId, currentTimestamp + cooldown);
  return true;
}

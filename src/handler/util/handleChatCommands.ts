import { client } from "../../index";
import { Message } from "discord.js";
import { hasCooldown, isAllowedCommand } from "./handleCommands";
import { getCommandOnCooldownEmbed, prefix } from "../../config";
import { CommandTypes, MessageCommandModule, PingCommandModule, PrefixCommandModule } from "../types/Command";

export async function handleMessageCommands(message: Message): Promise<void> {
    if (!client.user) return;
    if (message.content.startsWith(prefix)) await handleCommand(CommandTypes.PrefixCommand, message);
    else if (message.content.startsWith(`<@${client.user.id}>`)) await handleCommand(CommandTypes.PingCommand, message);
    else await handleCommand(CommandTypes.MessageCommand, message);
}

async function handleCommand(
    type: CommandTypes.PrefixCommand
        | CommandTypes.PingCommand
        | CommandTypes.MessageCommand,
    message: Message
): Promise<void> {
    if (!client.user) return;
    let commandName: string = "";
    let args: string[] = [];

    // Generate args
    if (type === CommandTypes.PrefixCommand) {
        // Remove the prefix and extract the command name
        const contentWithoutPrefix = message.content.slice(prefix.length).trim();
        const spaceIndex = contentWithoutPrefix.indexOf(' '); // Find where the command name ends

        // Extract command name and the rest of the arguments
        if (spaceIndex === -1) {
            commandName = contentWithoutPrefix; // Only command name, no args
        } else {
            commandName = contentWithoutPrefix.slice(0, spaceIndex); // Command name
            args = contentWithoutPrefix.slice(spaceIndex).trim().split(/\s+/); // Arguments after command name
        }
    } 
    else if (type === CommandTypes.PingCommand) {
        // Handle ping commands (though this is typically just a mention of the bot)
        commandName = message.content.split(" ")[1].replace(/ /g, "");
        message.content = message.content.replace(`<@${client.user.id}> ${commandName} `, "");

        args = message.content.trim().split(/\s+/); // Just in case, get args from message content
    }
    else if (type === CommandTypes.MessageCommand) {
        // For message commands, command name is first word
        commandName = message.content.split(" ")[0];

        // Generate the arguments (everything after command name)
        args = message.content.replace(commandName, "").trim().split(/\s+/);
    }

    // Get the command module based on the command name
    let commandModule: PrefixCommandModule | PingCommandModule | MessageCommandModule | string | undefined =
        client.commands[type].get(commandName) || client.commands.aliases[type].get(commandName);
    
    if (typeof commandModule === "string") commandModule = client.commands[type].get(commandModule);

    if (commandModule) {
        if (commandModule.permissions && !hasPermissions(message.member, commandModule.permissions)) {
            return;
        }

        const cooldown: number | boolean = hasCooldown(message.author.id, commandModule.name, commandModule.cooldown);
        if (typeof cooldown === "number") {
            await message.reply({
                embeds: [getCommandOnCooldownEmbed(cooldown, commandModule.name)]
            });
            return;
        }

        if (!await isAllowedCommand(commandModule, message.member?.user, message.guild, message.channel, message.member)) {
            // Now pass 'args' and 'prisma' to the execute method along with the message
            await commandModule.execute(client, message, args, client.db); // Pass args after command name, plus prisma
        }
    }
}

function hasPermissions(member: any, permissions: string[]): boolean {
    return permissions.every(permission => member.permissions.has(permission));
}

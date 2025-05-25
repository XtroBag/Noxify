import { DiscordClient } from "../Utils/Functions/Handlers/DiscordClient";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Collection,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    Message,
    SlashCommandBuilder
} from "discord.js";

export enum CommandTypes {
    SlashCommand = "slash",
    PrefixCommand = "prefix",
    MessageCommand = "message",
    PingCommand = "ping",
    ContextMenu = "context"
}

export enum RegisterTypes {
    Guild = "applicationGuildCommands",
    Global = "applicationCommands"
}

export interface CommandCollections {
    slash: Collection<string, SlashCommandModule>;
    prefix: Collection<string, PrefixCommandModule>;
    message: Collection<string, MessageCommandModule>;
    ping: Collection<string, PingCommandModule>;
    context: Collection<string, ContextMenuCommandModule>;
    aliases: CommandCollectionsAliases
}

export interface CommandCollectionsAliases {
    slash: Collection<string, string>;
    prefix: Collection<string, string>;
    message: Collection<string, string>;
    ping: Collection<string, string>;
    context: Collection<string, string>;
}

export interface CooldownCollections {
    user: Collection<string, Collection<string, number>>; 
}

export type CommandModule = SlashCommandModule | PrefixCommandModule | MessageCommandModule | PingCommandModule | ContextMenuCommandModule;

interface BaseCommandModule {
    cooldown?: number;
    ownerOnly: boolean;
    userWhitelist?: string[];
    userBlacklist?: string[];
    channelWhitelist?: string[];
    channelBlacklist?: string[];
    guildWhitelist?: string[];
    guildBlacklist?: string[];
    roleWhitelist?: string[];
    roleBlacklist?: string[];
    nsfw?: boolean;
    disabled: boolean;
}

export interface SlashCommandModule extends BaseCommandModule {
    type: CommandTypes.SlashCommand;
    register: RegisterTypes;
    data: SlashCommandBuilder;
    autocomplete?: (interaction: AutocompleteInteraction, client: DiscordClient) => Promise<any>;
    execute: (params: { client: DiscordClient, interaction: ChatInputCommandInteraction<'cached'> }) => Promise<any>;
}

export interface ContextMenuCommandModule extends BaseCommandModule {
    type: CommandTypes.ContextMenu;
    register: RegisterTypes;
    data: ContextMenuCommandBuilder;
    execute: (params: { client: DiscordClient, interaction: ContextMenuCommandInteraction<'cached'> }) => Promise<any>;
}

export interface PrefixCommandModule extends BaseCommandModule {
    name: string;
    aliases: string[];
    category: string;
    permissions?: string[];
    type: CommandTypes.PrefixCommand;
    execute: (params: { client: DiscordClient, message: Message, args: string[] }) => Promise<any>;
}

export interface MessageCommandModule extends BaseCommandModule {
    name: string;
    aliases?: string[];
    permissions?: string[];
    type: CommandTypes.MessageCommand;
    execute: (params: { client: DiscordClient, message: Message, args: string[] }) => Promise<any>;
}

export interface PingCommandModule extends BaseCommandModule {
    name: string;
    aliases?: string[];
    permissions?: string[];
    type: CommandTypes.PingCommand;
    execute: (params: { client: DiscordClient, message: Message, args: string[] }) => Promise<any>;
}


import { DiscordClient } from "../util/DiscordClient";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Collection,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    Message,
    SlashCommandBuilder
} from "discord.js";
import { Mongoose } from "mongoose";

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
    ownerOnly: boolean; // Now required
    userWhitelist?: string[];
    userBlacklist?: string[];
    channelWhitelist?: string[];
    channelBlacklist?: string[];
    guildWhitelist?: string[];
    guildBlacklist?: string[];
    roleWhitelist?: string[];
    roleBlacklist?: string[];
    nsfw?: boolean;
    disabled: boolean; // Now required
}

export interface SlashCommandModule extends BaseCommandModule {
    type: CommandTypes.SlashCommand;
    register: RegisterTypes;
    data: SlashCommandBuilder;
    autocomplete?: (interaction: AutocompleteInteraction, mongodb?: Mongoose) => Promise<any>; // used to be Promise<void>;
    execute: (client: DiscordClient, interaction: ChatInputCommandInteraction<'cached'>, mongodb?: Mongoose) => Promise<any>; // used to be Promise<void>;
}

export interface ContextMenuCommandModule extends BaseCommandModule {
    type: CommandTypes.ContextMenu;
    register: RegisterTypes;
    data: ContextMenuCommandBuilder;
    execute: (client: DiscordClient, interaction: ContextMenuCommandInteraction<'cached'>, mongodb?: Mongoose) => Promise<any>; // used to be Promise<void>;
}

export interface PrefixCommandModule extends BaseCommandModule {
    name: string;
    aliases?: string[];
    category: string;
    permissions?: string[];
    type: CommandTypes.PrefixCommand;
    execute: (client: DiscordClient, message: Message, args: string[], mongodb?: Mongoose) => Promise<any>; // used to be Promise<void>;
}

export interface MessageCommandModule extends BaseCommandModule {
    name: string;
    aliases?: string[];
    permissions?: string[];
    type: CommandTypes.MessageCommand;
    execute: (client: DiscordClient, message: Message, args: string[], mongodb?: Mongoose) => Promise<any>; // used to be Promise<void>;
}

export interface PingCommandModule extends BaseCommandModule {
    name: string;
    aliases?: string[];
    permissions?: string[];
    type: CommandTypes.PingCommand;
    execute: (client: DiscordClient, message: Message, args: string[], mongodb?: Mongoose) => Promise<any>; // used to be Promise<void>;
}

export interface RegisterCommandOptions {
    deploy: boolean;
}

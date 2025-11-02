import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { Noxify } from "../handlers/Client";

/**
 * A function that executes when a slash command is triggered.
 */
type SlashCommandHandler = (args: {
  client: Noxify;
  interaction: ChatInputCommandInteraction;
}) => Promise<void>;

/**
 * A function that handles autocomplete interactions.
 */
type AutocompleteHandler = (args: {
  client: Noxify;
  interaction: AutocompleteInteraction;
}) => Promise<void>;

/**
 * Optional settings for command behavior.
 */
interface CommandSettings {
  enabled: boolean;
  developerOnly: boolean;
}

/**
 * Structure defining a command, including its data, handlers, and settings.
 */
interface CommandDefinition {
  data:
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder;
  options: CommandSettings;
  execute: SlashCommandHandler;
  autocomplete?: AutocompleteHandler;
}

/**
 * The Command class used to register and handle slash commands.
 */
export default class Command {
  data:
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder;
  options: CommandSettings;
  execute: SlashCommandHandler;
  autocomplete?: AutocompleteHandler;

  constructor(definition: CommandDefinition) {
    this.data = definition.data;
    this.options = definition.options;
    this.execute = definition.execute;
    this.autocomplete = definition.autocomplete;
  }
}
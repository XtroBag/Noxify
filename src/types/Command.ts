import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type { Noxify } from "../handlers/Client";

interface CommandOptions {
  enabled?: boolean;
  developerOnly?: boolean;
}

export default class Command {
  public data: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder;
  public execute: (client: Noxify, interaction: ChatInputCommandInteraction<'cached'>) => Promise<void>;
  public enabled: boolean;
  public developerOnly: boolean;

  constructor(
    data: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder,
    options: CommandOptions = {},
    execute: (client: Noxify, interaction: ChatInputCommandInteraction<'cached'>) => Promise<void>
  ) {
    this.data = data;
    this.execute = execute;
    this.enabled = options.enabled ?? true;
    this.developerOnly = options.developerOnly ?? false;
  }
}
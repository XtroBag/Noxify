import Logger from "./Logger";
import { Intent } from "../types/Intent";
import { defaultIntents } from "../../config";
import { registerEvents } from "./handleEvents";
import { registerComponents,  } from "./handleComponents";
import { EventIntentMapping } from "../types/EventIntentMapping";
import { AnySelectMenuInteraction, ButtonInteraction, Client, Collection, IntentsBitField, ModalSubmitInteraction } from "discord.js";
import { ComponentCollections, ComponentModule } from "../types/Component";
import {
  deleteAllCommands,
  deleteCommands,
  registerCommands,
} from "./handleCommands";
import mongoose, { Mongoose } from "mongoose";
import {
  CommandCollections,
  ContextMenuCommandModule,
  CooldownCollections,
  ItemCollections,
  MessageCommandModule,
  PingCommandModule,
  PrefixCommandModule,
  RegisterCommandOptions,
  RegisterTypes,
  SlashCommandModule,
} from "../types/Command";
import { DatabaseOptions, DrinkData, IngredientData, MealData, WeaponData } from "../types/Database";
import { connectDatabase } from "./DatabaseCalls";
import { registerItems } from "./handleItems";

export class DiscordClient extends Client {
  public events: string[];
  public commands: CommandCollections;
  public components: ComponentCollections;
  public cooldowns: CooldownCollections;
  public items: ItemCollections;
  public db: Mongoose;

  constructor(options: ConstructorParameters<typeof Client>[0]) {
    super(options);
    this.events = [];
    this.commands = {
      slash: new Collection<string, SlashCommandModule>(),
      prefix: new Collection<string, PrefixCommandModule>(),
      message: new Collection<string, MessageCommandModule>(),
      ping: new Collection<string, PingCommandModule>(),
      context: new Collection<string, ContextMenuCommandModule>(),
      aliases: {
        slash: new Collection<string, string>(),
        prefix: new Collection<string, string>(),
        message: new Collection<string, string>(),
        ping: new Collection<string, string>(),
        context: new Collection<string, string>(),
      },
    };
    this.components = {
      buttons: new Collection<string, ComponentModule<ButtonInteraction<'cached'>>>(),
      selectMenus: new Collection<string, ComponentModule<AnySelectMenuInteraction<'cached'>>>(),
      modals: new Collection<string, ComponentModule<ModalSubmitInteraction<'cached'>>>(),
    };
    this.cooldowns = {
      user: new Collection<string, Collection<string, number>>(),
    };
    this.items = {
      weapon: new Collection<string, WeaponData>(),
      ingredient: new Collection<string, IngredientData>(),
      drink: new Collection<string, DrinkData>(),
      meal: new Collection<string, MealData>()

    };
    this.db = mongoose;
  }

  public async registerDatabase(
    options: DatabaseOptions
  ): Promise<void> {
    await connectDatabase(this, options);
  }

  public async registerEvents(): Promise<void> {
    await registerEvents(this);
  }

  public async registerCommands(
    options: RegisterCommandOptions
  ): Promise<void> {
    await registerCommands(this, options);
  }

  public async deleteCommand(
    commandId: string,
    type: RegisterTypes
  ): Promise<void> {
    await deleteCommands([commandId], type);
  }

  public async deleteCommands(
    commandIds: string[],
    type: RegisterTypes
  ): Promise<void> {
    await deleteCommands(commandIds, type);
  }

  public async deleteAllCommands(type: RegisterTypes): Promise<void> {
    await deleteAllCommands(type);
  }

  public async registerComponents(): Promise<void> {
    await registerComponents(this);
  }

  public async registerItems(): Promise<void> {
    await registerItems(this);
  }

  public async connect(token: string | undefined): Promise<void> {
    if (token === undefined)
      return Logger.error("Token is undefined. Please provide a valid token.");
    if (!this.options.intents.bitfield) await this.setIntents();
    try {
      await this.login(token);
    } catch (err) {
      Logger.error("Failed to connect to the bot:", err);
    }
  }

  public async setIntents(): Promise<void> {
    const intentBitField: IntentsBitField = new IntentsBitField();

    this.events.forEach((event) => {
      const intents: Intent[] = EventIntentMapping[event];
      if (intents)
        Array.from(intents).forEach((intent) => intentBitField.add(intent));
    });

    defaultIntents.forEach((intent) => {
      intentBitField.add(intent);
    });

    this.options.intents = intentBitField;
  }
}

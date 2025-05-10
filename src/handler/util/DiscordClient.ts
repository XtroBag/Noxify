import Logger from "./Logger";
import { AutomaticIntents, Intent } from "../types/Intent";
import { defaultIntents } from "../../config";
import { registerEvents } from "./handleEvents";
import { registerComponents } from "./handleComponents";
import { EventIntentMapping } from "../types/EventIntentMapping";
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  Client,
  Collection,
  IntentsBitField,
  ModalSubmitInteraction,
  SimpleShardingStrategy,
} from "discord.js";
import { ComponentCollections, ComponentModule } from "../types/Component";
import {
  deleteAllCommands,
  deleteCommands,
  registerCommands,
} from "./HandleCommands";
import {
  CommandCollections,
  ContextMenuCommandModule,
  CooldownCollections,
  ItemCollections,
  MessageCommandModule,
  PingCommandModule,
  PrefixCommandModule,
  RegisterTypes,
  SlashCommandModule,
} from "../types/Command";
import {
  Meal,
  Drink,
  Weapon,
  Item as Ingredient,
  Ammo,
} from "../types/economy/EconomyItem";
import { registerItems } from "./handleItems";
import { Utilities } from "./Utilities";

export class DiscordClient extends Client {
  public events: string[];
  public commands: CommandCollections;
  public components: ComponentCollections;
  public cooldowns: CooldownCollections;
  public items: ItemCollections;
  public utils: Utilities;
  public replies: Map<string, string>;

  constructor() {
    super({
      intents: AutomaticIntents,
      // This is how you can make a bot using discord.js have a mobile status icon !
      //
      // ws: {
      //   buildStrategy: (ws) => {
      //     ws.options.identifyProperties.browser = "Discord iOS";
      //     return new SimpleShardingStrategy(ws);
      //   },
      // },
    });
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
      buttons: new Collection<
        string,
        ComponentModule<ButtonInteraction<"cached">>
      >(),
      selectMenus: new Collection<
        string,
        ComponentModule<AnySelectMenuInteraction<"cached">>
      >(),
      modals: new Collection<
        string,
        ComponentModule<ModalSubmitInteraction<"cached">>
      >(),
    };
    this.cooldowns = {
      user: new Collection<string, Collection<string, number>>(),
    };
    this.items = {
      weapons: new Collection<string, Weapon>(),
      ingredients: new Collection<string, Ingredient>(),
      drinks: new Collection<string, Drink>(),
      meals: new Collection<string, Meal>(),
      ammos: new Collection<string, Ammo>(),
    };
    this.utils = new Utilities(this);
    this.replies = new Map<string, string>();
  }

  public async registerDatabase(): Promise<void> {
    this.utils.databaseConnection();
  }

  public async registerEvents(): Promise<void> {
    await registerEvents(this);
  }

  public async registerCommands(): Promise<void> {
    await registerCommands(this);
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

  public connect() {
    if (process.env.CLIENT_TOKEN === undefined)
      return Logger.error("Token is undefined. Please provide a valid token.");
    if (!this.options.intents.bitfield) this.setIntents();
    try {
      this.login(process.env.CLIENT_TOKEN);
    } catch (err) {
      Logger.error("Failed to connect to the bot:", err);
    }
  }

  public setIntents(): IntentsBitField {
    const intentBitField: IntentsBitField = new IntentsBitField();

    this.events.forEach((event) => {
      const intents: Intent[] = EventIntentMapping[event];
      if (intents)
        Array.from(intents).forEach((intent) => intentBitField.add(intent));
    });

    defaultIntents.forEach((intent) => {
      intentBitField.add(intent);
    });

    return (this.options.intents = intentBitField);
  }
}

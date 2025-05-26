import Logger from "./Logger.js";
import { AutomaticIntents, Intent } from "../../../Types/Intent.js";
import { defaultIntents } from "../../../../config.js";
import { registerCommands, deleteAllCommands, deleteCommands } from "./HandleCommands.js";
import { registerComponents } from "./HandleComponents.js";
import { registerEvents } from "./HandleEvents.js";
import { EventIntentMapping } from "../../../Types/EventIntentMapping.js";
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  Client,
  Collection,
  IntentsBitField,
  ModalSubmitInteraction,
  SimpleShardingStrategy,
} from "discord.js";
import { ComponentCollections, ComponentModule } from "../../../Types/Component.js";

import {
  CommandCollections,
  ContextMenuCommandModule,
  CooldownCollections,
  MessageCommandModule,
  PingCommandModule,
  PrefixCommandModule,
  RegisterTypes,
  SlashCommandModule,
} from "../../../Types/Command.js";
import { Utilities } from "./Utilities.js";

export class DiscordClient extends Client {
  public events: string[];
  public commands: CommandCollections;
  public components: ComponentCollections;
  public cooldowns: CooldownCollections;
  public utils: Utilities;
  public replies: Map<string, string>;
  constructor() {
    super({
      intents: AutomaticIntents,
      // This is how you can make a bot using discord.js have a mobile status icon !
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
    }
    
    this.cooldowns = {
      user: new Collection<string, Collection<string, number>>(),
    };
    this.utils = new Utilities(this);
    this.replies = new Map<string, string>();
  }

  public async registerDatabase() {
    this.utils.registerDatabase();
  }

  public async registerEvents() {
    await registerEvents(this);
  }

  public async registerCommands() {
    await registerCommands(this);
  }

  public async registerComponents() {
    await registerComponents(this);
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
      intentBitField.add(intent)
    });

    return (this.options.intents = intentBitField);
  }

  public start() {
    this.registerDatabase();
    this.registerEvents();
    this.registerCommands();
    this.registerComponents();
    this.connect();
  }
}

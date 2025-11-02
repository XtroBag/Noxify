import {
  Client,
  Collection,
  GatewayIntentBits,
  IntentsBitField,
  Partials,
} from "discord.js";
import { loadEvents } from "./EventHandler";
import { config } from "dotenv";
import Command from "../types/Command";
import { loadCommands } from "./CommandHandler";
import { Modrinth } from "typerinth";

config({ quiet: true });

export class Noxify extends Client<true> {
  commands: Collection<string, Command>;
  modrinth: Modrinth;

  constructor() {
    super({
      intents: [
        new IntentsBitField([
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ]),
      ],
      partials: [Partials.GuildMember, Partials.Channel, Partials.Message],
      allowedMentions: {
        parse: ["everyone"],
        repliedUser: true,
      },
    });
    this.commands = new Collection();
    this.modrinth = new Modrinth({
      baseUrl: "https://api.modrinth.com",
      apiVersion: "v2",
      userAgent: "Noxify/1.0.0",
    });
  }

  /**
   * Gets an environment variable.
   * @param {string} key - The environment variable name.
   * @param {string} [defaultValue=''] - Optional default value.
   * @returns {string} The environment variable value or the default.
   */
  env(key: string, defaultValue: string = ""): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
      console.log(`Environment variable ${key} is not set`);
    }
    return value;
  }

  async start(token: string) {
    await loadEvents(this);
    await loadCommands(this);

    return this.login(token);
  }
}

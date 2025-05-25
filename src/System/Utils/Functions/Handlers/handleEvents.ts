import { glob } from "glob";
import Logger from "./Logger.js";
import { eventsFolderName } from "../../../../config.js";
import { DiscordClient } from "./DiscordClient.js";
import { EventModule } from "../../../Types/EventModule.js";
import { ClientEvents, Events } from "discord.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Type helper to infer the correct event argument types
type EventArguments<T extends keyof ClientEvents | Events> =
  T extends keyof ClientEvents ? ClientEvents[T] : never;

export async function registerEvents(client: DiscordClient): Promise<void> {
  const eventsPaths: string[] = await glob(`dist/${eventsFolderName}/**/**/*.js`);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  for (const eventPath of eventsPaths) {
    const absolutePath = path.resolve(eventPath);
    const relativePath = path
      .relative(__dirname, absolutePath)
      .replace(/\\/g, "/");

    const importPath = `./${relativePath}`;

    try {
      // Dynamically import the event module
      const eventModule: EventModule<keyof ClientEvents> = (
        await import(importPath)
      ).default;

      const { name, execute, once } = eventModule;

      // Register event with correct argument types
      client.events.push(name);

      // Handle events and their arguments dynamically
      if (once) {
        client.once(
          String(name),
          (...args: EventArguments<typeof name>) => execute({ client, args }) // Pass client and args in an object
        );
      } else {
        client.on(
          String(name),
          (...args: EventArguments<typeof name>) => execute({ client, args }) // Pass client and args in an object
        );
      }
    } catch (err) {
      Logger.error(`Failed to load event at: ${importPath}`, err);
    }
  }
}

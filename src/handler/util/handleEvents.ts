import { glob } from "glob";
import Logger from "./Logger";
import { eventsFolderName } from "../../config";
import { DiscordClient } from "./DiscordClient";
import { EventModule } from "../types/EventModule";
import { ClientEvents, Events } from "discord.js";

// Type helper to infer the correct event argument types
type EventArguments<T extends keyof ClientEvents | Events> =
  T extends keyof ClientEvents ? ClientEvents[T] : never;

export async function registerEvents(client: DiscordClient): Promise<void> {
  const eventsPaths: string[] = await glob(`**/${eventsFolderName}/**/**/*.js`);

  for (const eventPath of eventsPaths) {
    const importPath: string = `../..${eventPath.replace(/^dist[\\\/]|\\/g, "/")}`;

    try {
      // Dynamically import the event module
      const eventModule: EventModule<keyof ClientEvents> = (await import(importPath)).default;

      const { name, execute, once } = eventModule;

      // Register event with correct argument types
      client.events.push(name);

      // Handle events and their arguments dynamically
      if (once) {
        client.once(String(name), (...args: EventArguments<typeof name>) =>
          execute({ client, args })  // Pass client and args in an object
        );
      } else {
        client.on(String(name), (...args: EventArguments<typeof name>) =>
          execute({ client, args })  // Pass client and args in an object
        );
      }
    } catch (err) {
      Logger.error(`Failed to load event at: ${importPath}`, err);
    }
  }
}

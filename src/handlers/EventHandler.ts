import { readdirSync } from "fs";
import { join } from "path";
import { Noxify } from "./Client";
import Event from "../types/Event";

export const loadEvents = async (client: Noxify): Promise<void> => {
  const eventsPath = join(__dirname, "../events");
  const eventFiles = readdirSync(eventsPath).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const imported = await import(filePath);
    const event: Event<any> = imported.default;

    if (
      !event ||
      typeof event.name !== "string" ||
      typeof event.execute !== "function"
    ) {
      console.warn(`⚠️ | Skipping invalid event file: ${file}`);
      continue;
    }

      if (event.enabled === false) {
      console.log(`⚠️ | Skipping disabled event: ${event.name}`);
      continue;
    }

    event.once
      ? client.once(event.name, (...args: any[]) =>
          event.execute(client, ...args)
        )
      : client.on(event.name, (...args: any[]) =>
          event.execute(client, ...args)
        );

    console.log(`✅ | Event Loaded: ${event.name}`);
  }
};

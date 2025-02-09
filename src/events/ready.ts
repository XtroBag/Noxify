import Logger from "../handler/util/Logger";
import { Events } from "discord.js";
import { EventModule } from "../handler/types/EventModule";

export = {
  name: Events.ClientReady,
  once: true,
  async execute({ client, args: [readyClient] }) {
    if (!client.user) return;

      readyClient.user.setPresence({
        status: "online",
        activities: [
          {
            name: "Best Discord App",
          },
        ],
      });

    Logger.log(`Ready! Logged in as ${readyClient.user.tag}`);
  },
} as EventModule<"ready">;

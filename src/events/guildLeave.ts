import { EventModule } from "../handler";
import { Events, Guild } from "discord.js";
import { Server } from "../handler/schemas/models/Models"; // Assuming you have a model like this for the server schema

export = {
  name: Events.GuildDelete,
  async execute(client, guild: Guild): Promise<void> {
    try {
      // Find the server data by guildID and delete it
      const guildData = await Server.findOneAndDelete({ guildID: guild.id });

      if (!guildData) {
        return;
      }

    } catch (error) {
      console.error("Error deleting guild data:", error);
    }
  }
} as EventModule;

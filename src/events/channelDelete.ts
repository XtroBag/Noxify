import { EventModule } from "../handler";
import { Events, GuildChannel } from "discord.js";
import { Server } from "../handler/schemas/models/Models"; // Assuming you have a model like this for the server schema.

export = {
  name: Events.ChannelDelete,
  async execute(client, channel: GuildChannel): Promise<void> {
    try {
      const guildData = await Server.findOne({ guildID: channel.guild.id });

      if (!guildData) {
        return;
      }

      if (guildData.loggingChannel === channel.id) {
        guildData.loggingActive = false;
        guildData.loggingChannel = "";

        await guildData.save();
      }
    } catch (error) {
      console.error("Error handling channel delete:", error);
    }
  },
} as EventModule;

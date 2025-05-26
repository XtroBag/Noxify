import { EventModule } from "../../System/Types/Event.js";
import { ChannelType, Events } from "discord.js";
import { Server } from "../../System/Schemas/Models/Models.js";

export default {
  name: Events.ChannelDelete,
  async execute({ client, args: [channel] }): Promise<void> {
    if (channel.type === ChannelType.GuildText) {
      const guildData = await Server.findOne({ guildID: channel.guildId });

      if (!guildData) return;

      if (guildData.loggingChannel === channel.id) {
        guildData.loggingActive = false;
        guildData.loggingChannel = "";

        await guildData.save();
        
      }
    }
  },
} as EventModule<"channelDelete">;

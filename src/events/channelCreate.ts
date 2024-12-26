import { EventModule } from "../handler";
import {
  Events,
  GuildChannel,
  TextChannel,
  Permissions,
  ChannelType,
} from "discord.js";
import { Server } from "../handler/schemas/models/Models";

export = {
  name: Events.ChannelCreate,
  async execute(client, channel: GuildChannel): Promise<void> {
    try {
      if (channel instanceof TextChannel && channel.name === "noxify-logs") {
        // Find the guild's data from the database
        const guildData = await Server.findOne({ guildID: channel.guild.id });

        if (guildData) {
          if (!guildData.loggingActive || !guildData.loggingChannel) {
            guildData.loggingChannel = channel.id;
            guildData.loggingActive = true;
            await guildData.save();
          }
        }
      } else {
        const guildData = await Server.findOne({ guildID: channel.guild.id });

        if (guildData && !guildData.loggingActive) {
          const createdChannel = await channel.guild.channels.create({
            name: "noxify-logs",
            reason: "Default logging channel for actions from Noxify",
            topic:
              "**WARNING** if you delete this channel logging will be deactivated, recreate it with same name for it to enable again.",
            type: ChannelType.GuildText,
          });

          guildData.loggingChannel = createdChannel.id;
          guildData.loggingActive = true;
          await guildData.save();
        }
      }
    } catch (error) {
      console.error("Error handling channel creation event:", error);
    }
  },
} as EventModule;

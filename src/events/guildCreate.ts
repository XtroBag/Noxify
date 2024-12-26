import { EventModule } from "../handler";
import { Server } from "../handler/schemas/models/Models";
import { ChannelType, Events, Guild } from "discord.js";

export = {
  name: Events.GuildCreate,
  async execute(client, guild: Guild): Promise<void> {
    try {
      if (guild.members.me.permissions.has("ManageChannels")) {
        const loggingChannel = await guild.channels.create({
          name: "noxify-logs",
          reason: "Default logging channel for actions from Noxify",
          topic:
            "**WARNING** if you delete this channel logging will be deactivated, recreate it with same name for it to enable again.",
          type: ChannelType.GuildText,
        });

        const existingChannel = guild.channels.cache.find(
          (channel) => channel.name === "noxify-logs"
        );

        if (existingChannel) {
          return;
        }

        new Server({
          name: guild.name,
          guildID: guild.id,
          loggingChannel: loggingChannel.id,
        }).save();
      } else {
        return;
      }
    } catch (err) {
      console.error("Error creating logging channel:", err);
    }
  },
} as EventModule;

import { EventModule } from "../handler";
import { Events, Message, TextChannel } from "discord.js";
import { Server } from "../handler/schemas/models/Models";

export = {
  name: Events.MessageDelete,
  async execute(client, message: Message): Promise<void> {
    try {

      if (message.author.bot) return;

      const guildData = await Server.findOne({ guildID: message.guild.id });

      if (!guildData || !guildData.loggingActive) {
        return;
      }

      if (message.channel instanceof TextChannel) {
        const loggingChannel = await message.guild.channels.fetch(
          guildData.loggingChannel
        );

        if (loggingChannel && loggingChannel.isTextBased()) {
          await loggingChannel.send({
            content:
              `**Message Deleted in #${message.channel.name}**\n` +
              `**Author**: ${message.author.tag}\n` +
              `**Message**: ${message.content || "*No content*"}\n` +
              `**Deleted at**: ${new Date().toLocaleString()}`,
            flags: ["SuppressNotifications"],
            allowedMentions: { repliedUser: false },
          });
        }
      }
    } catch (error) {
      console.error("Error handling message delete event:", error);
    }
  },
} as EventModule;

import { EventModule } from "../../handler";
import {
  channelMention,
  EmbedBuilder,
  Events,
  Message,
  TextChannel,
  userMention,
} from "discord.js";
import { Server } from "../../handler/schemas/models/Models";
import { Colors } from "../../config";

export = {
  name: Events.MessageDelete,
  async execute(client, message: Message): Promise<any> {
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

        if (!loggingChannel) return;

        const attachments = message.attachments;

        if (loggingChannel && loggingChannel.isTextBased()) {
          const embed = new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Message Deleted")
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL({ extension: "png" }),
            })
            .setThumbnail(message.author.displayAvatarURL({ extension: "png" }))
            .setDescription(
              `Member: ${userMention(
                message.author.id
              )}\nDeleted In: ${channelMention(message.channelId)}\nMessage: ${
                message.content || "*No content*"
              }\nTime: ${new Date().toLocaleString()}`
            );

          const videoUrls = [];
          const pictureUrls = [];

          for (const attachment of attachments.values()) {
            if (attachment.url) {
              const attachmentType = attachment.contentType.startsWith("image/")
                ? "Pictures"
                : "Videos";
              if (attachmentType === "Videos") {
                videoUrls.push(attachment.url);
              } else {
                pictureUrls.push(attachment.url);
              }
            }
          }

          if (pictureUrls.length > 0) {
            embed.addFields({
              name: "Pictures:",
              value: pictureUrls.join("\n"),
              inline: true,
            });
          }

          if (videoUrls.length > 0) {
            embed.addFields({
              name: "Videos:",
              value: videoUrls.join("\n"),
              inline: true,
            });
          }

          if (videoUrls.length === 0 && pictureUrls.length === 0) {
            embed.addFields({ name: "Attachments:", value: "No Attachments" });
          }

          await loggingChannel.send({
            embeds: [embed],
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

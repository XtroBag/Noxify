import { EventModule } from "../../System/Types/Event.js";
import {
  channelMention,
  EmbedBuilder,
  Events,
  TextChannel,
  userMention,
} from "discord.js";
import { Server } from "../../System/Schemas/Models/Models.js";
import { Colors } from "../../config.js";

export default {
  name: Events.MessageUpdate,
  async execute({ client, args: [oldMessage, newMessage] }) {
    if (oldMessage.author.bot) return;

    const guildData = await Server.findOne({ guildID: oldMessage.guild.id });

    if (!guildData) return Server.create({
      name: oldMessage.guild.name,
      guildID: oldMessage.guild.id
    })

    if (!guildData || !guildData.loggingActive) {
      return;
    }

    if (oldMessage.channel instanceof TextChannel) {
      const loggingChannel = await oldMessage.guild.channels.fetch(
        guildData.loggingChannel
      );

      if (!loggingChannel) return;

      if (loggingChannel && loggingChannel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(Colors.Normal)
          .setTitle("Message Updated")
          .setAuthor({
            name: oldMessage.guild.name,
            iconURL: oldMessage.guild.iconURL({ extension: "png" }),
          })
          .setThumbnail(
            newMessage.author.displayAvatarURL({ extension: "png" })
          )
          .setDescription(
            `Member: ${userMention(newMessage.author.id)}\n` +
              `Channel: ${channelMention(newMessage.channel.id)}\n` +
              `Time: ${new Date().toLocaleString()}\n` +
              `Old Message: ${oldMessage.content || "*No content*"}\n` +
              `New Message: ${newMessage.content || "*No content*"}`
          );

        await loggingChannel.send({
          embeds: [embed],
          flags: ["SuppressNotifications"],
          allowedMentions: { repliedUser: false },
        });
      }
    }
  },
} as EventModule<"messageUpdate">;

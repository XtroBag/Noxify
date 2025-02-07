import { Server } from "../../handler/schemas/models/Models";
import { EventModule } from "../../handler/types/EventModule";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  Events,
  inlineCode,
  userMention,
} from "discord.js";
import { Colors, defaultPrefix } from "../../config";

export = {
  name: Events.GuildMemberAdd,
  async execute({ client, args: [member] }) {
    const guild = await Server.findOne({ guildID: member.guild.id });

    if (!guild) return Server.create({
      name: member.guild.name,
      guildID: member.guild.id,
      prefix: defaultPrefix
    })

    const loggingChannel = guild.get("loggingChannel");
    const loggingActive = guild.get("loggingActive");

    if (!guild || !loggingActive) return;

    const channel = await member.guild.channels.fetch(loggingChannel);
    if (!channel) return;

    if (channel.type === ChannelType.GuildText) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Normal)
        .setAuthor({
          name: member.guild.name,
          iconURL: member.guild.iconURL({ extension: "png" }),
        })
        .setThumbnail(member.displayAvatarURL({ extension: "png" }))
        .setTitle("Member Joined")
        .setDescription(
          `Member: ${userMention(member.id)}\n` +
            `UserID: ${inlineCode(member.user.id)}\n` +
            `Joined: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n` +
            `Account Created: <t:${Math.floor(
              member.user.createdTimestamp / 1000
            )}:R>\n` +
            `Bot: ${member.user.bot ? "Yes" : "No"}\n` +
            `Member Count: ${member.guild.memberCount}`
        );

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`loggingKick|${member.id}`)
          .setLabel("Kick")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`loggingBan|${member.id}`)
          .setLabel("Ban")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        embeds: [embed],
        components: [row],
        flags: ["SuppressNotifications"],
        allowedMentions: { repliedUser: false },
      });
    }
  },
} as EventModule<"guildMemberAdd">;

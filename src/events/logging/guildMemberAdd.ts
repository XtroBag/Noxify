import { Server } from "../../System/Schemas/Models/Models.js";
import { EventModule } from "../../System/Types/EventModule.js";
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
import { Colors, defaultPrefix } from "../../config.js";

export default {
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
          .setCustomId(`loggingKick|<loggedUserId:${member.id}>`)
          .setLabel("Kick")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`loggingBan|<loggedUserId:${member.id}>`)
          .setLabel("Ban")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        embeds: [embed],
        components: [row],
        flags: ["SuppressNotifications"],
        allowedMentions: { repliedUser: false },
      });


      // ------------------------------------------------------------------------------------



      //   // Define placeholders and their replacements
      //   const placeholders = {
      //     "{username}": interaction.user.username,
      //     "{userid}": interaction.user.id,
      //     "{userjoined}": `<t:${Math.floor(
      //       interaction.member.joinedTimestamp / 1000
      //     )}:F>`,
      //     "{mentionuser:<ID>}": (id: string) => {
      //       const user = client.users.cache.get(id);
      //       return user ? `<@${user.id}>` : "Unknown";
      //     },
      //     "{mentionchannel:<ID>}": (id: string) => {
      //       const channel = interaction.guild.channels.cache.get(id);
      //       return channel ? `<#${channel.id}>` : "Unknown";
      //     },
      //     "{newline}": "\n",
      //     "{servername}": interaction.guild.name,
      //     "{membercount}": interaction.guild.memberCount.toString(),
      //     "{owner}": `<@${interaction.guild.ownerId}>`,
      //     "{time}": `<t:${Math.floor(Date.now() / 1000)}:T>`,
      //     "{userrole}": interaction.member.roles.highest
      //       ? interaction.member.roles.highest.name
      //       : "No Role",
      //   };

      //   // Replace placeholders in the message
      //   const formattedMessage = message.replace(
      //     /{mentionuser:<(\d+)>}|{mentionchannel:<(\d+)>}|{\w+}/g,
      //     (match, userId, channelId) => {
      //       if (userId) return placeholders["{mentionuser:<ID>}"](userId);
      //       if (channelId)
      //         return placeholders["{mentionchannel:<ID>}"](channelId);
      //       return placeholders[match] || match;
      //     }
      //   );
    }
  },
} as EventModule<"guildMemberAdd">;

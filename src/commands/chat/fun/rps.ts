import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import {
  CommandTypes,
  PrefixCommandModule,
} from "../../../System/Types/Command.js";
import { Colors, Emojis } from "../../../config.js";

export default {
  name: "rps",
  category: "fun",
  aliases: [],
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    if (message.channel.isSendable() && message.channel.type === ChannelType.GuildText) {

      const embed = new EmbedBuilder()
      .setTitle("Rock, Paper, Scissors - Start")
      .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(`Rock|<UserID:${message.member.id}>`)
        .setEmoji(Emojis.Rock)
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId(`Paper|<UserID:${message.member.id}>`)
        .setEmoji(Emojis.Paper)
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId(`Scissors|<UserID:${message.member.id}>`)
        .setEmoji(Emojis.Scissors)
        .setStyle(ButtonStyle.Secondary),
      )

      const reply = await message.reply({ embeds: [embed], components: [row] });
      client.replies.set(message.id, reply.id);
    }
  },
} as PrefixCommandModule;

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  Message,
  MessageReaction,
  User,
} from "discord.js";
import {
  CommandTypes,
  PrefixCommandModule,
} from "../../../handler/types/Command";
import { Colors, Emojis } from "../../../config";

export = {
  name: "rps",
  category: "fun",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    if (message.channel.isSendable() && message.channel.type === ChannelType.GuildText) {

      const embed = new EmbedBuilder()
      .setTitle("Rock, Paper, Scissors - Start")
      .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(`Rock|${message.member.id}`)
        .setEmoji(Emojis.Rock)
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId(`Paper|${message.member.id}`)
        .setEmoji(Emojis.Paper)
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId(`Scissors|${message.member.id}`)
        .setEmoji(Emojis.Scissors)
        .setStyle(ButtonStyle.Secondary),
      )

      await message.reply({ embeds: [embed], components: [row] });
    }
  },
} as PrefixCommandModule;

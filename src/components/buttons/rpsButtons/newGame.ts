import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../System/Types/Component.js";
import { Emojis, Colors } from "../../../config.js";

export default {
  id: "newGame",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">, params) {
    if (
      button.channel.isSendable() &&
      button.channel.type === ChannelType.GuildText
    ) {
      const embed = new EmbedBuilder()
        .setTitle("Rock, Paper, Scissors - Start")
        .setColor(Colors.Normal);

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
          .setCustomId(`Rock|<UserID:${button.member.id}>`)
          .setEmoji(Emojis.Rock)
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId(`Paper|<UserID:${button.member.id}>`)
          .setEmoji(Emojis.Paper)
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId(`Scissors|<UserID:${button.member.id}>`)
          .setEmoji(Emojis.Scissors)
          .setStyle(ButtonStyle.Secondary),
        )

      await button.update({ embeds: [embed], components: [row] });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

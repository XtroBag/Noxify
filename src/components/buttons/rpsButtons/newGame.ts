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
} from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";

export = {
  id: "newGame",
  type: ComponentTypes.Button,
  async execute(
    client,
    button: ButtonInteraction<"cached">,
    extras
  ): Promise<any> {
    // const userID = extras[0];

      if (
        button.channel.isSendable() &&
        button.channel.type === ChannelType.GuildText
      ) {
        const embed = new EmbedBuilder()
          .setTitle("Rock, Paper, Scissors - Start")
          .setColor(Colors.Normal);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`Rock|${button.member.id}`)
            .setEmoji(Emojis.Rock)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`Paper|${button.member.id}`)
            .setEmoji(Emojis.Paper)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`Scissors|${button.member.id}`)
            .setEmoji(Emojis.Scissors)
            .setStyle(ButtonStyle.Secondary)
        );

        await button.update({ embeds: [embed], components: [row] });
      }
    
  },
} as ComponentModule<ButtonInteraction<"cached">>;

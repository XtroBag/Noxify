import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import {
  ComponentTypes,
  ComponentModule,
} from "../../../handler/types/Component";
import { Colors, Emojis } from "../../../config";

export = {
  id: "ASMConfigMenu",
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    const originalUserID = extras[0];

    if (interaction.member.id !== originalUserID) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} This panel is reserved for <@${originalUserID}> to use.`
            ),
        ],
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Configuration Settings")
        .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`ASMMainOptions|${originalUserID}`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ASMCooldowns|${originalUserID}`)
          .setLabel("Cooldowns")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`ASMChannels|${originalUserID}`)
          .setLabel("Channels")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.update({
        components: [row],
        embeds: [embed],
      });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

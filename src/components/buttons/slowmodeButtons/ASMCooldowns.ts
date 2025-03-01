import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";

export = {
  id: "ASMCooldowns",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const originalUserID = extras[0];

    if (button.member.id !== originalUserID) {
      await button.reply({
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
      const modal = new ModalBuilder()
        .setCustomId(`ASMTimes|${originalUserID}`)
        .setTitle("Slowmode Cooldown Times");

      const shortestTime = new TextInputBuilder()
        .setCustomId("shortestAmount")
        .setLabel("Shortest Time")
        .setRequired(true)
        .setPlaceholder("Provide the time in a format: 10s, 30m, 2h")
        .setMinLength(1)
        .setStyle(TextInputStyle.Short);

      const moderateTime = new TextInputBuilder()
        .setCustomId("moderateAmount")
        .setLabel("Moderate Time")
        .setRequired(true)
        .setPlaceholder("Provide the time in a format: 10s, 30m, 2h")
        .setMinLength(1)
        .setStyle(TextInputStyle.Short);

      const highestTime = new TextInputBuilder()
        .setCustomId("highestAmount")
        .setLabel("Highest Time")
        .setRequired(true)
        .setPlaceholder("Provide the time in a format: 10s, 30m, 2h")
        .setMinLength(1)
        .setStyle(TextInputStyle.Short);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(shortestTime),
        new ActionRowBuilder<TextInputBuilder>().addComponents(moderateTime),
        new ActionRowBuilder<TextInputBuilder>().addComponents(highestTime)
      );

      await button.showModal(modal);
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

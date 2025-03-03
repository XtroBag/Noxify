import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  ComponentTypes,
  ComponentModule,
} from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";

export = {
  id: "ASMMessage",
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    const originalUserID = extras[0];
    const selected = extras[1];

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
      const modal = new ModalBuilder()
        .setTitle("Welcome Message")
        .setCustomId(`ASMWelcomeMessage|${originalUserID}|${selected}`);

      const customMessage = new TextInputBuilder()
        .setCustomId("customWelcomeMessage")
        .setLabel("Message")
        .setRequired(true)
        .setPlaceholder("Set a message to tell new users who joined")
        .setMinLength(7)
        .setMaxLength(4000)
        .setStyle(TextInputStyle.Paragraph);

      modal.setComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(customMessage)
      );

      await interaction.showModal(modal);
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

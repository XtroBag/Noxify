import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Server } from "../../handler/schemas/models/Models";
import { Colors, Emojis } from "../../config";

export = {
  id: "ASMWelcomeMessage",
  type: ComponentTypes.Modal,
  async execute(client, interaction, extras) {
    const originalUserID = extras[0];
    // const selected = extras[1];

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
      return;
    } else {
      const message = interaction.fields.getTextInputValue(
        "customWelcomeMessage"
      );

      await Server.updateOne(
        { guildID: interaction.guild.id },
        { $set: { "autoWelcome.message": message } }
      );

      await interaction.deferUpdate();
    }
  },
} as ComponentModule<ModalSubmitInteraction<"cached">>;

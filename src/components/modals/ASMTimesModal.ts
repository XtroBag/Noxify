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
import ms from "ms";

export = {
  id: "ASMTimes",
  type: ComponentTypes.Modal,
  async execute(client, interaction, extras) {
    const originalUserID = extras[0];
    const selected = extras[1];

    if (interaction.member.id !== originalUserID) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`${Emojis.Cross} This panel is reserved for <@${originalUserID}> to use.`),
        ],
        ephemeral: true,
      });
    } else {

    try {
      const shortestTime = Math.floor(
        ms(interaction.fields.getTextInputValue("shortestAmount")) / 1000
      );
      const moderateTime = Math.floor(
        ms(interaction.fields.getTextInputValue("moderateAmount")) / 1000
      );
      const highestTime = Math.floor(
        ms(interaction.fields.getTextInputValue("highestAmount")) / 1000
      );

      if (
        isNaN(shortestTime) ||
        isNaN(moderateTime) ||
        isNaN(highestTime) ||
        shortestTime <= 0 ||
        moderateTime <= 0 ||
        highestTime <= 0
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${Emojis.Cross} Invalid time format! Please use values like "10s", "30m", "2h", etc.`
              )
              .setColor(Colors.Error),
          ],
          ephemeral: true,
        });
      }

      await Server.updateOne(
        { guildID: interaction.guildId },
        {
          $set: {
            "autoSlowmode.shortestTime": shortestTime,
            "autoSlowmode.moderateTime": moderateTime,
            "autoSlowmode.highestTime": highestTime,
          },
        }
      );

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`ASMMainOptions|${originalUserID}|${selected}`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ASMCooldowns|${originalUserID}|${selected}`)
          .setLabel("Cooldowns")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`ASMChannels|${originalUserID}|${selected}`)
          .setLabel("Channels")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.deferUpdate();
      await interaction.editReply({ components: [row] });

    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${Emojis.Cross} An error occurred while saving slowmode times.`
            )
            .setColor(Colors.Error),
        ],
        ephemeral: true,
      });
    }
  }
  },
} as ComponentModule<ModalSubmitInteraction<"cached">>;

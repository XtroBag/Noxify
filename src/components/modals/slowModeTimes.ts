import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Server } from "../../handler/schemas/models/Models";
import { Colors, Emojis } from "../../config";
import ms from "ms";

export = {
  id: "slowmodeTimes",
  type: ComponentTypes.Modal,
  async execute(client, interaction, extras) {
    try {
      const shortestTime = Math.floor(ms(interaction.fields.getTextInputValue("shortestAmount")) / 1000);
      const moderateTime = Math.floor(ms(interaction.fields.getTextInputValue("moderateAmount")) / 1000);
      const highestTime = Math.floor(ms(interaction.fields.getTextInputValue("highestAmount")) / 1000);

      if (isNaN(shortestTime) || isNaN(moderateTime) || isNaN(highestTime) || shortestTime <= 0 || moderateTime <= 0 || highestTime <= 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`${Emojis.Cross} Invalid time format! Please use values like "10s", "30m", "2h", etc.`)
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

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${Emojis.Check} Successfully saved the new slowmode times`)
            .setColor(Colors.Success),
        ],
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${Emojis.Cross} An error occurred while saving slowmode times.`)
            .setColor(Colors.Error),
        ],
        ephemeral: true,
      });
    }
  },
} as ComponentModule<ModalSubmitInteraction<"cached">>;

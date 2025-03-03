import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import {
  ComponentTypes,
  ComponentModule,
} from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";

export = {
  id: `ASMMainMenu`,
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    const originalUserID = extras[0];

    const guild = await client.utils.getGuild(interaction.guildId);

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
      .setTitle("Systems Configuration")
      .setDescription(
        `${Emojis.AutoSlowMode} Auto Slowmode ${
          guild.autoSlowmode.enabled ? Emojis.Check : Emojis.Cross
        }\n${Emojis.AutoWelcome} Auto Welcome ${
          guild.autoWelcome.enabled ? Emojis.Check : Emojis.Cross
        }`
      )
      .setColor(Colors.Normal);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`SystemMenu|${originalUserID}`)
          .setPlaceholder("Click a system to enable it.")
          .addOptions([
            {
              emoji: `${Emojis.AutoSlowMode}`,
              label: "Auto Slowmode",
              value: "ASM-Selection",
              description: `A custom slowmode per amount of messages sent.`,
            },
            {
              emoji: `${Emojis.AutoWelcome}`,
              label: "Auto Welcome",
              value: "AW-Selection",
              description: `A limit to set on amount of caps allowed in a message.`,
            },
          ])
      );

      await interaction.update({ embeds: [embed], components: [row] });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

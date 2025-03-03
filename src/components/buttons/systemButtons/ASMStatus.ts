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
import { Server } from "../../../handler/schemas/models/Models";
import { Emojis, Colors } from "../../../config";

export = {
  id: "ASMStatus",
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
      if (selected === "ASM-Selection") {
        const guild = await client.utils.getGuild(interaction.guildId);
        const status = guild.autoSlowmode.enabled;

        await Server.updateOne(
          { guildID: interaction.guildId },
          { $set: { "autoSlowmode.enabled": !status } }
        );

        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId(`ASMMainMenu|${originalUserID}`)
            .setLabel("Menu")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`ASMStatus|${originalUserID}|${selected}`)
            .setLabel(!status ? "Disable" : "Enable")
            .setStyle(!status ? ButtonStyle.Danger : ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`ASMConfigMenu|${originalUserID}|${selected}`)
            .setLabel("Config")
            .setDisabled(!status ? false : true)
            .setStyle(ButtonStyle.Primary)
        );

        await interaction.update({ components: [row] });
      } else if (selected === "AW-Selection") {
        const guild = await client.utils.getGuild(interaction.guildId);
        const status = guild.autoWelcome.enabled;

        await Server.updateOne(
          { guildID: interaction.guildId },
          { $set: { "autoWelcome.enabled": !status } }
        );

        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId(`ASMMainMenu|${originalUserID}`)
            .setLabel("Menu")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`ASMStatus|${originalUserID}|${selected}`)
            .setLabel(!status ? "Disable" : "Enable")
            .setStyle(!status ? ButtonStyle.Danger : ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`ASMConfigMenu|${originalUserID}|${selected}`)
            .setLabel("Config")
            .setDisabled(!status ? false : true)
            .setStyle(ButtonStyle.Primary)
        );

        await interaction.update({ components: [row] });
      }
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

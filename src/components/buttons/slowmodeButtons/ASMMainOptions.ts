import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";
import { Colors, Emojis } from "../../../config";

export = {
  id: "ASMMainOptions",
  type: ComponentTypes.Button,
  async execute(client, button, extras): Promise<void> {
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
      const guild = await client.utils.getGuild(button.guildId);

      const embed = new EmbedBuilder()
        .setDescription(
          "**AutoSlowmode System**\n\n" +
            "Manage the AutoSlowmode system to prevent spam and control chat flow.\n\n" +
            "**Menu** – Return to the main menu.\n" +
            "**Enable/Disable** – Toggle the system on or off.\n" +
            "**Config** – Customize settings (only available when enabled)."
        )
        .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`ASMMainMenu|${originalUserID}`)
          .setLabel("Menu")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ASMStatus|${originalUserID}`)
          .setLabel(guild.autoSlowmode.enabled ? "Disable" : "Enable")
          .setStyle(
            guild.autoSlowmode.enabled
              ? ButtonStyle.Danger
              : ButtonStyle.Success
          ),
        new ButtonBuilder()
          .setCustomId(`ASMConfigMenu|${originalUserID}`)
          .setLabel("Config")
          .setDisabled(guild.autoSlowmode.enabled ? false : true)
          .setStyle(ButtonStyle.Primary)
      );

      await button.update({ components: [row], embeds: [embed] });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

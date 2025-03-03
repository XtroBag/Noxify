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
    const selected = extras[1];

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
      if (selected === "ASM-Selection") {
        const guild = await client.utils.getGuild(button.guildId);

        const embed = new EmbedBuilder()
          .setDescription(
            "**Auto Slowmode System**\n\n" +
              "Manage the Auto Slowmode system to prevent spam and control chat flow.\n\n" +
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
            .setCustomId(`ASMStatus|${originalUserID}|${selected}`)
            .setLabel(guild.autoSlowmode.enabled ? "Disable" : "Enable")
            .setStyle(
              guild.autoSlowmode.enabled
                ? ButtonStyle.Danger
                : ButtonStyle.Success
            ),
          new ButtonBuilder()
            .setCustomId(`ASMConfigMenu|${originalUserID}|${selected}`)
            .setLabel("Config")
            .setDisabled(guild.autoSlowmode.enabled ? false : true)
            .setStyle(ButtonStyle.Primary)
        );

        await button.update({ components: [row], embeds: [embed] });






        
      } else if (selected === "AW-Selection") {

        const guild = await client.utils.getGuild(button.guildId);

        const embed = new EmbedBuilder()
        .setDescription(
          "**Auto Welcome System**\n\n" +
            "Manage the Auto Welcome system to greet new members and enhance engagement.\n\n" +
            "**Menu** – Return to the main menu.\n" +
            "**Enable/Disable** – Toggle the welcome system on or off.\n" +
            "**Config** – Customize settings (only available when enabled)."
        )
        .setColor(Colors.Normal);

        
        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId(`ASMMainMenu|${originalUserID}`)
            .setLabel("Menu")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`ASMStatus|${originalUserID}|${selected}`)
            .setLabel(guild.autoWelcome.enabled ? "Disable" : "Enable")
            .setDisabled(guild.autoWelcome.enabled ? false : true)
            .setStyle(
              guild.autoWelcome.enabled
                ? ButtonStyle.Danger
                : ButtonStyle.Success
            ),
          new ButtonBuilder()
            .setCustomId(`ASMConfigMenu|${originalUserID}|${selected}`)
            .setLabel("Config")
            .setStyle(ButtonStyle.Primary)
        );

        await button.update({ components: [row], embeds: [embed] });
      }
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

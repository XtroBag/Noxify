import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Colors, Emojis } from "../../config";

export = {
  id: "SecurityMenu",
  type: ComponentTypes.SelectMenu,
  async execute(client, menu, extras): Promise<void> {
    const selected = menu.values[0];
    const originalUserID = extras[0];

    if (menu.member.id !== originalUserID) {
      await menu.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`${Emojis.Cross} This panel is reserved for <@${originalUserID}> to use.`),
        ],
        ephemeral: true,
      });
    } else {
      if (selected === "ASM-Selection") {
        const guild = await client.utils.getGuild(menu.guildId);

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

        await menu.update({ components: [row], embeds: [embed] });
      } else if (selected === "ATC-Selection") {
        // const embed = new EmbedBuilder()
        //   .setDescription("Configure the settings for the AntiCaps system")
        //   .setColor(Colors.Normal);
        // const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        //   new ButtonBuilder()
        //     .setCustomId(`ASMBackMain`)
        //     .setLabel("Back")
        //     .setStyle(ButtonStyle.Secondary),
        //   new ButtonBuilder()
        //     .setCustomId(`ASMConfigMenu`)
        //     .setLabel("Config")
        //     .setStyle(ButtonStyle.Primary)
        // );
        // await menu.update({ components: [row], embeds: [embed] });
      }
    }
  },
} as ComponentModule<StringSelectMenuInteraction<"cached">>;

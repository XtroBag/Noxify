import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Colors, Emojis } from "../../config";
import { Server } from "../../handler/schemas/models/Models";

export = {
  id: "ASMPicks",
  type: ComponentTypes.SelectMenu,
  async execute(client, menu, extras): Promise<void> {
    const originalUserID = extras[0];
    const channels = menu.values;
    const selected = extras[1];

    if (menu.member.id !== originalUserID) {
      await menu.reply({
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
      await Server.findOneAndUpdate(
        { guildID: menu.guildId },
        { $set: { "autoSlowmode.channels": channels } }
      );

      const embed = new EmbedBuilder()
      .setTitle("Slowmode Settings")
      .setDescription(
        "Use the buttons below to configure automatic slowmode settings:\n\n" +
        "**Back** – Return to the main options menu.\n" +
        "**Cooldowns** – Adjust cooldown settings.\n" +
        "**Channels** – Manage which channels have slow mode enabled."
      )
      .setColor(Colors.Normal);

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

      await menu.update({
        components: [row],
        embeds: [embed],
      });
    }
  },
} as ComponentModule<StringSelectMenuInteraction<"cached">>;

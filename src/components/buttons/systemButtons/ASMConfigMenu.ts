import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
} from "discord.js";
import {
  ComponentTypes,
  ComponentModule,
} from "../../../handler/types/Component";
import { Colors, Emojis } from "../../../config";

export = {
  id: "ASMConfigMenu",
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    const originalUserID = extras[0];
    const selectedChoice = extras[1]

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
    if (selectedChoice === 'ASM-Selection') {
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
          .setCustomId(`ASMMainOptions|${originalUserID}|${selectedChoice}`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ASMCooldowns|${originalUserID}`)
          .setLabel("Cooldowns")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`ASMChannels|${originalUserID}|${selectedChoice}`)
          .setLabel("Channels")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.update({
        components: [row],
        embeds: [embed],
      });

    } else if (selectedChoice === 'AW-Selection') {
      const embed = new EmbedBuilder()
      .setTitle("Welcome Settings")
      .setDescription(
        "Use the buttons below to configure the automatic welcome system:\n\n" +
        "**Back** – Return to the main options menu.\n" +
        "**Message** – Customize the welcome message.\n" +
        "**Channel** – Select the channel for welcoming.\n\n" +
        "**Available Placeholders:**\n" +
        `${inlineCode("{name}")} → The user's username\n` +
        `${inlineCode("{userid}")} → The user's unique ID\n` +
        `${inlineCode("{joined}")} → The timestamp when the user joined\n` +
        `${inlineCode("{umention:<ID>}")} → Mention a specific user\n` +
        `${inlineCode("{cmention:<ID>}")} → Mention a specific channel\n` +
        `${inlineCode("{newline}")} → Represents a new line\n` +
        `${inlineCode("{server}")} → The name of the server\n` +
        `${inlineCode("{membercount}")} → The total number of members in the server\n` +
        `${inlineCode("{owner}")} → The username of the server owner\n` +
        `${inlineCode("{time}")} → Inserts the current time\n` +
        `${inlineCode("{role}")} → Displays the highest role of the user`
      )
      .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
        .setCustomId(`ASMMainOptions|${originalUserID}|${selectedChoice}`)
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId(`ASMMessage|${originalUserID}|${selectedChoice}`)
        .setLabel('Message')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId(`ASMWelcomeChannel|${originalUserID}|${selectedChoice}`)
        .setLabel('Channel')
        .setStyle(ButtonStyle.Primary),
      )

      await interaction.update({
        components: [row],
        embeds: [embed]
      });
    }
  }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

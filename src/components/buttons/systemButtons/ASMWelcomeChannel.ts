import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
} from "discord.js";
import {
  ComponentTypes,
  ComponentModule,
} from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";
import { Server } from "../../../handler/schemas/models/Models";

export = {
  id: `ASMWelcomeChannel`,
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
      const helpfulmenu = new EmbedBuilder()
        .setTitle("Welcome Channel Selection")
        .setDescription(
          `This is the channel where your welcome messages will be sent.`
        );

      const channelrow =
        new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId("WelcomeChannelPick")
            .addChannelTypes([ChannelType.GuildText])
            .setMinValues(1)
            .setMaxValues(1)
        );

      const response = await interaction.update({
        embeds: [helpfulmenu],
        components: [channelrow],
      });


      // !!! !!! !!!
      // TAKE THIS IDEA AND APPLY IT TO THE OTHER CHANNEL SELECT MENU FOR AUTOSLOWMODE AND REMOVE THE EXTRA FILE THAT THE CODE IS INSIDE OF TO HANDLE THE MENU
      // !!! !!! !!!
      
      const component = await response.awaitMessageComponent({
        componentType: ComponentType.ChannelSelect,
        filter: ({ user }) => user.id === originalUserID,
      });

      const value = component.values[0];

      await Server.updateOne(
        { guildID: interaction.guild.id },
        { $set: { "autoWelcome.channel": value } }
      );

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
            `${inlineCode(
              "{membercount}"
            )} → The total number of members in the server\n` +
            `${inlineCode("{owner}")} → The username of the server owner\n` +
            `${inlineCode("{time}")} → Inserts the current time\n` +
            `${inlineCode("{role}")} → Displays the highest role of the user`
        )
        .setColor(Colors.Normal);

      const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        // new ButtonBuilder()
        //   .setCustomId(`ASMMainOptions|${originalUserID}|${selected}`)
        //   .setLabel("Back")
        //   .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ASMMessage|${originalUserID}|${selected}`)
          .setLabel("Message")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`ASMWelcomeChannel|${originalUserID}|${selected}`)
          .setLabel("Channel")
          .setStyle(ButtonStyle.Primary)
      );

      await component.update({
        embeds: [embed],
        components: [row]
      });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

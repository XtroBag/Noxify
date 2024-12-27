import { Server } from "../../../handler/schemas/models/Models";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import { ChannelType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Colors } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("logging")
    .setDescription("Enabled the servers logging system")
    .addBooleanOption((option) =>
      option
        .setName("status")
        .setDescription("enable or disable the logging system")
        .setRequired(true)
    ),
  async execute(client, interaction, db) {
    const status = interaction.options.getBoolean("status");

    if (interaction.member.permissions.has("ManageGuild")) {
      try {
        const guildSettings = await Server.findOne(
          { guildID: interaction.guildId },
          null,
          { new: true }
        );

        const loggingChannel = guildSettings.get("loggingChannel");

        if (status === true) {
          if (!loggingChannel) {
            const loggingChannel = await interaction.guild.channels.create({
              name: "noxify-logs",
              reason: "Default logging channel for actions from Noxify",
              topic:
                "📣 **WARNING** if you delete this channel logging will be deactivated!",
              type: ChannelType.GuildText,
            });

            await Server.updateOne(
              { guildID: interaction.guildId },
              { loggingActive: true, loggingChannel: loggingChannel.id }
            );
          }

          if (loggingChannel)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Warning)
                  .setDescription(
                    `This server has a logging channel already setup.`
                  ),
              ],
            });

          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Success)
                .setDescription(
                  `You're servers logging channel has been enabled!`
                ),
            ],
          });
        } else if (status === false) {
          if (loggingChannel) {
            // Delete the logging channel
            const channel = await interaction.guild.channels.fetch(
              loggingChannel
            );
            if (channel) {
              await channel.delete("Logging system disabled");
            }

            // Update the server settings to disable logging
            await Server.updateOne(
              { guildID: interaction.guildId },
              { loggingActive: false, loggingChannel: "" }
            );

            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Success)
                  .setDescription(
                    "Logging has been disabled and the logging channel has been deleted."
                  ),
              ],
            });
          }

          // If there is no logging channel found
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Warning)
                .setDescription("Logging is not enabled in this server."),
            ],
          });
        }
      } catch (error) {
        console.error("Error updating logging settings:", error);
        await interaction.reply({
          content: "Failed to update logging settings. Please try again.",
        });
      }
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`You are missing "ManageGuild" permissions`),
        ],
      });
    }
  },
} as SlashCommandModule;

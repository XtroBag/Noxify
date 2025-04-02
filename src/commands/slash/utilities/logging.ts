import { Server } from "../../../handler/schemas/models/Models";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ApplicationIntegrationType,
  ChannelType,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Colors } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("logging")
    .setDescription("Enabled the servers logging system")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addBooleanOption((option) =>
      option
        .setName("status")
        .setDescription("enable or disable the logging system")
        .setRequired(true)
    ),
  async execute({ client, interaction }) {
    const status = interaction.options.getBoolean("status");

    try {
      const guildSettings = await client.utils.getGuild(interaction.guildId);

      const loggingChannel = guildSettings.loggingChannel;

      if (status === true) {
        if (!loggingChannel) {
          const loggingChannel = await interaction.guild.channels.create({
            name: "noxify-logs",
            reason: "Default logging channel for actions from Noxify",
            topic:
              "📣 **WARNING** if you delete this channel logging will be deactivated!",
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone.id,
                deny: ["ViewChannel", "SendMessages"],
              },
              {
                id: interaction.guild.members.me.id,
                allow: [
                  "ViewChannel",
                  "SendMessages",
                  "EmbedLinks",
                  "ManageChannels",
                ],
              },
            ],
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
          const channel = await interaction.guild.channels.fetch(
            loggingChannel
          );
          if (channel) {
            await channel.delete("Logging system disabled");
          }

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
  },
} as SlashCommandModule;

import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("auto-slowmode")
    .setDescription("Automatically manage slowmode settings for your server")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute({ client, interaction }) {
    const server = await client.utils.getGuild(interaction.guildId);

    const isEnabled = server.autoSlowmode.enabled;

    const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeToggle|<Id:${interaction.member.id}>`)
        .setLabel(isEnabled ? "Enabled" : "Disabled")
        .setStyle(isEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeTimes|<Id:${interaction.member.id}>`)
        .setLabel("Times")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled),
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeChannels|<Id:${interaction.member.id}>`)
        .setLabel("Channels")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled)
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setDescription(`Configure auto slowmode settings for this server.`);

    await interaction.reply({ embeds: [embed], components: [buttons] });
  },
} as SlashCommandModule;

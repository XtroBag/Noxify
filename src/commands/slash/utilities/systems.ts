import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("systems")
    .setDescription(
      "This command enables various server systems for user management and more."
    )
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute({ client, interaction }) {
    const guild = await client.utils.getGuild(interaction.guildId);

    const embed = new EmbedBuilder()
      .setTitle("Systems Configuration")
      .setDescription(
        `${Emojis.AutoSlowMode} Auto Slowmode ${
          guild.autoSlowmode.enabled ? Emojis.Check : Emojis.Cross
        }\n${Emojis.AutoWelcome} Auto Welcome ${
          guild.autoWelcome.enabled ? Emojis.Check : Emojis.Cross
        }`
      )
      .setColor(Colors.Normal);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`SystemMenu|${interaction.member.id}`)
        .setPlaceholder("Click a system to enable it.")
        .addOptions([
          {
            emoji: `${Emojis.AutoSlowMode}`,
            label: "Auto Slowmode",
            value: "ASM-Selection",
            description: `A custom slowmode per amount of messages sent.`,
          },
          {
            emoji: `${Emojis.AutoWelcome}`,
            label: "Auto Welcome",
            value: "AW-Selection",
            description: `A limit to set on amount of caps allowed in a message.`,
          },
        ])
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
} as SlashCommandModule;

import { Server } from "../../../handler/schemas/models/Models";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ActionRow,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Colors } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("test the new embed system")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute({ client, interaction }) {

    const container = new ContainerBuilder()

    const yes = new ButtonBuilder()
    .setCustomId('yes-button')
    .setLabel('Yes')
    .setStyle(ButtonStyle.Success)

    container.addActionRowComponents((component) => component.addComponents(yes))

    await interaction.reply({ components: [container], flags: [MessageFlags.IsComponentsV2] });

  },
} as SlashCommandModule;

import { Server } from "../../../System/Schemas/Models/Models.js";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../System/Types/Command.js";
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
import { Colors } from "../../../config.js";

export default {
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

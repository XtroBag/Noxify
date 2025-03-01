import { Colors, Emojis } from "../../../config";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler/types/Command";
import { ActionRowBuilder, ApplicationIntegrationType, EmbedBuilder, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Global,
    data: new SlashCommandBuilder()
        .setName("security")
        .setDescription("This command enables various server systems for user management and more.")
        .setContexts([InteractionContextType.Guild])
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute({ client, interaction }) {

        const embed = new EmbedBuilder()
            .setTitle('Security System Configuration')
            .setColor(Colors.Normal)

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .setComponents(new StringSelectMenuBuilder()
                .setCustomId(`SecurityMenu|${interaction.member.id}`)
                .setPlaceholder('Click a system to enable it.')
                .addOptions([
                    { emoji: `${Emojis.AutoSlowMode}`, label: 'Auto Slowmode', value: 'ASM-Selection', description: `A custom slowmode per amount of messages sent.` },
                    { emoji: `${Emojis.AntiCaps}`, label: 'Anti Caps', value: 'ATC-Selection', description: `A limit to set on amount of caps allowed in a message.` }
                ])
            );

        await interaction.reply({ embeds: [embed], components: [row] });

    },
} as SlashCommandModule;

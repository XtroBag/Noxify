import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle
} from "discord.js";
import { ComponentTypes, ComponentModule } from "../../../handler/types/Component";
import { Server } from "../../../handler/schemas/models/Models";

export = {
    id: 'autoslowmodeStatus',
    type: ComponentTypes.Button,
    async execute(client, interaction, extras) {

        const guild = await client.utils.getGuild(interaction.guildId);
        const currentStatus = guild.autoSlowmode.enabled;
        const newStatus = !currentStatus;

        await Server.updateOne({ guildID: interaction.guildId }, { $set: { "autoSlowmode.enabled": newStatus } });

        const row = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId(`securityBack`)
                    .setLabel('Back')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`autoslowmodeStatus`)
                    .setLabel(newStatus ? 'Disable' : 'Enable')
                    .setStyle(newStatus ? ButtonStyle.Danger : ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`autoslowmodeConfigurtion`)
                    .setLabel('Configuration')
                    .setDisabled(newStatus ? false : true)
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.update({ components: [row] });
    },
} as ComponentModule<ButtonInteraction<"cached">>;

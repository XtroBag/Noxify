import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { ComponentTypes, ComponentModule } from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";


export = {
    id: `securityBack`,
    type: ComponentTypes.Button,
    async execute(client, interaction, extras) {
        
        const embed = new EmbedBuilder()
            .setTitle('Security System Configuration')
            .setColor(Colors.Normal)

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .setComponents(new StringSelectMenuBuilder()
                .setCustomId(`securityMenu`)
                .setPlaceholder('Click a system to enable it.')
                .addOptions([
                    { emoji: `${Emojis.AutoSlowMode}`, label: 'Auto Slowmode', value: 'autoSlowmode', description: `A custom slowmode per amount of messages sent.` },
                    { emoji: `${Emojis.AntiCaps}`, label: 'Anti Caps', value: 'antiCaps', description: `A limit to set on amount of caps allowed in a message.`}
                ])
            );

        await interaction.update({ embeds: [embed], components: [row] });
    },
} as ComponentModule<ButtonInteraction<"cached">>;

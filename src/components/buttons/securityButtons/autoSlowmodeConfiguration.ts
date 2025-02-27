import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ComponentTypes, ComponentModule } from "../../../handler/types/Component";


export = {
    id: 'autoslowmodeConfigurtion',
    type: ComponentTypes.Button,
    async execute(client, interaction, extras) {

        const modal = new ModalBuilder()
            .setCustomId('slowmodeTimes')
            .setTitle('Slowmode Cooldown Times');
        

        const shortestTime = new TextInputBuilder()
            .setCustomId('shortestAmount')
            .setLabel("Shortest Time")
            .setRequired(true)
            .setPlaceholder('Please provide the time in seconds')
            // .setMaxLength()
            .setMinLength(1)
            .setStyle(TextInputStyle.Short);

        const moderateTime = new TextInputBuilder()
            .setCustomId('moderateAmount')
            .setLabel("Moderate Time")
            .setRequired(true)
            .setPlaceholder('Please provide the time in seconds')
            // .setMaxLength()
            .setMinLength(1)
            .setStyle(TextInputStyle.Short);

        const highestTime = new TextInputBuilder()
            .setCustomId('highestAmount')
            .setLabel("Highest Time")
            .setRequired(true)
            .setPlaceholder('Please provide the time in seconds')
            // .setMaxLength()
            .setMinLength(1)
            .setStyle(TextInputStyle.Short);

        const shortestTimeAmount = new ActionRowBuilder<TextInputBuilder>().addComponents(shortestTime);
        const moderateTimeAmount = new ActionRowBuilder<TextInputBuilder>().addComponents(moderateTime);
        const highestTimeAmount = new ActionRowBuilder<TextInputBuilder>().addComponents(highestTime);

        modal.addComponents(shortestTimeAmount, moderateTimeAmount, highestTimeAmount);

        await interaction.showModal(modal);
    },
} as ComponentModule<ButtonInteraction<"cached">>;

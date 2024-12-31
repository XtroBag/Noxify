import { ButtonInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
  id: `default-button`,
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    console.log(extras);

    await interaction.deferUpdate();
  },
} as ComponentModule<ButtonInteraction<'cached'>>;

import { ButtonInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
    id: "default-button",
    type: ComponentTypes.Button,
    async execute(client, interaction: ButtonInteraction<'cached'>): Promise<void> {}
} as ComponentModule;
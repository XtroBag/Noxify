import { ModalSubmitInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";


export = {
  id: "default",
  type: ComponentTypes.Modal,
  async execute(
    client,
    interaction,
    extras
  ) {},
} as ComponentModule<ModalSubmitInteraction<'cached'>>;

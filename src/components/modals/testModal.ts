import { ModalSubmitInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";


export = {
  id: "default",
  type: ComponentTypes.Modal,
  async execute(
    client,
    interaction: ModalSubmitInteraction<"cached">
  ): Promise<void> {},
} as ComponentModule;

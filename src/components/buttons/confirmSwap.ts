import { ButtonInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
  id: "confirm-swap",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const fromUserID = extras[0];
    const toUserID = extras[1];
  },
} as ComponentModule<ButtonInteraction<"cached">>;

import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";

export = {
  id: "AutoSlowmodeTimes",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const modal = new ModalBuilder()
      .setTitle("Slowmode Cooldown Times")
      .setCustomId("SlowmodeTimesModal");

    const shortestTimeInput = new TextInputBuilder()
      .setCustomId("shortestTime")
      .setLabel("Shortest Time (in seconds)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const moderateTimeInput = new TextInputBuilder()
      .setCustomId("moderateTime")
      .setLabel("Moderate Time (in seconds)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const highestTimeInput = new TextInputBuilder()
      .setCustomId("highestTime")
      .setLabel("Highest Time (in seconds)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(shortestTimeInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(moderateTimeInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(highestTimeInput)
    );

    await button.showModal(modal);
  },
} as ComponentModule<ButtonInteraction<"cached">>;

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";

export = {
  id: "AutoSlowmodeToggle",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const server = await client.utils.getGuild(button.guildId);

    const newState = !server.autoSlowmode.enabled;
    await client.utils.autoSlowmodeToggle({
      guildID: button.guildId,
      toggle: newState,
    });

    const updatedServer = await client.utils.getGuild(button.guildId);
    const isEnabled = updatedServer.autoSlowmode.enabled;

    const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId("AutoSlowmodeToggle")
        .setLabel(isEnabled ? "Enabled" : "Disabled")
        .setStyle(isEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("AutoSlowmodeTimes")
        .setLabel("Times")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled),
      new ButtonBuilder()
        .setCustomId("AutoSlowmodeChannels")
        .setLabel("Channels")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled)
    );

    await button.update({ components: [buttons] });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

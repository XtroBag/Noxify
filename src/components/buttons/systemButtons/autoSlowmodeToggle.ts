import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  userMention,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";
import { Colors } from "../../../config";

export = {
  id: "AutoSlowmodeToggle",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const server = await client.utils.getGuild(button.guildId);

    if (extras[0] !== button.member.id) {
      return await button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `This menu is exclusively available for ${userMention(
                extras[0]
              )} only.`
            ),
        ],
        ephemeral: true
      });
    }

    const newState = !server.autoSlowmode.enabled;
    await client.utils.autoSlowmodeToggle({
      guildID: button.guildId,
      toggle: newState,
    });

    const updatedServer = await client.utils.getGuild(button.guildId);
    const isEnabled = updatedServer.autoSlowmode.enabled;

    const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeToggle|${button.member.id}`)
        .setLabel(isEnabled ? "Enabled" : "Disabled")
        .setStyle(isEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeTimes|${button.member.id}`)
        .setLabel("Times")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled),
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeChannels|${button.member.id}`)
        .setLabel("Channels")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled)
    );

    await button.update({ components: [buttons] });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

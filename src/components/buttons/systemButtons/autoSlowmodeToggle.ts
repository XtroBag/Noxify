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
} from "../../../System/Types/Component.js";
import { Colors } from "../../../config.js";

export default {
  id: "AutoSlowmodeToggle",
  type: ComponentTypes.Button,
  async execute(client, button, params) {
    const server = await client.utils.getGuild(button.guildId);

    if (params.Id !== button.member.id) {
      return await button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `This menu is exclusively available for ${userMention(
                params.Id
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
        .setCustomId(`AutoSlowmodeToggle|<Id:${button.member.id}>`)
        .setLabel(isEnabled ? "Enabled" : "Disabled")
        .setStyle(isEnabled ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeTimes|<Id:${button.member.id}>`)
        .setLabel("Times")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled),
      new ButtonBuilder()
        .setCustomId(`AutoSlowmodeChannels|<Id:${button.member.id}>`)
        .setLabel("Channels")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!isEnabled)
    );

    await button.update({ components: [buttons] });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

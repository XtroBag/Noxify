import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";
import { Colors } from "../../../config";

export = {
  id: "AutoSlowmodeChannels",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {

    const server = await client.utils.getGuild(button.guildId);

    await button.deferUpdate();
    await button.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Normal)
          .setDescription(
            `Please select some channels to enable the system inside of`
          ),
      ],
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId("slowmodeChannels")
            .setPlaceholder('Select Channels')
            .setChannelTypes([ChannelType.GuildText, ChannelType.PublicThread])
            .setDefaultChannels(server.autoSlowmode.channels)
            .setMinValues(1)
            .setMaxValues(25)
        ),
      ],
    });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

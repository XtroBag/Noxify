import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  MessageFlags,
  userMention,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";
import { Colors } from "../../../config";

export = {
  id: "AutoSlowmodeChannels",
  type: ComponentTypes.Button,
  async execute(client, button, params) {
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
        ephemeral: true,
      });
    }

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
            .setCustomId(`slowmodeChannels|${params.Id}`)
            .setPlaceholder("Select Channels")
            .setChannelTypes([ChannelType.GuildText, ChannelType.PublicThread])
            .setDefaultChannels(server.autoSlowmode.channels)
            .setMinValues(1)
            .setMaxValues(25)
        ),
      ],
    });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

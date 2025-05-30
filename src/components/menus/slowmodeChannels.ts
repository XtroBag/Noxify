import {
  inlineCode,
  StringSelectMenuInteraction,
  EmbedBuilder,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../System/Types/Component.js";
import { Emojis, Colors } from "../../config.js";

export default {
  id: "slowmodeChannels",
  type: ComponentTypes.SelectMenu,
  async execute(client, menu, params) {
    const channelIDs = menu.values;

    if (params.Id !== menu.member.id) {
      return await menu.reply({
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

    const channelNamesWithPermissions: string[] = [];
    const channelNamesMissingPermissions: string[] = [];
    const channelsToSave: string[] = [];

    for (const id of channelIDs) {
      const channel = await menu.guild.channels.fetch(id);
      if (!channel) {
        channelNamesMissingPermissions.push(`Unknown Channel (${id})`);
        continue;
      }

      const permissions = channel.permissionsFor(client.user);

      if (permissions?.has("ViewChannel") && permissions?.has("SendMessages")) {
        channelNamesWithPermissions.push(`${Emojis.Check} <#${channel.id}>`);
        channelsToSave.push(channel.id); // Save channel to database
      } else {
        let missingPermissions = [];
        if (!permissions?.has("ViewChannel"))
          missingPermissions.push(inlineCode("ViewChannel"));
        if (!permissions?.has("SendMessages"))
          missingPermissions.push(inlineCode("SendMessages"));

        const missingPermissionsText = missingPermissions.length
          ? missingPermissions.join(" | ")
          : "Unknown issue with permissions.";

        channelNamesMissingPermissions.push(
          `${Emojis.Cross} <#${channel.id}> - ${missingPermissionsText}`
        );
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("Slowmode Channel Permissions Check")
      .setColor(Colors.Normal)
      .setDescription(
        "Below are the results of the permission check for the selected channels."
      );

    if (channelNamesWithPermissions.length) {
      embed.addFields({
        name: "Channels with Correct Permissions:",
        value: channelNamesWithPermissions.join("\n"),
        inline: false,
      });
    }

    if (channelNamesMissingPermissions.length) {
      embed.addFields({
        name: "Channels Missing Permissions:",
        value: channelNamesMissingPermissions.join("\n"),
        inline: false,
      });
    }

    await menu.update({ embeds: [embed] });

    if (channelsToSave.length > 0) {
      await client.utils.autoSlowmodeSetChannels({
        guildID: menu.guildId,
        channels: channelsToSave,
      });
    }
  },
} as ComponentModule<StringSelectMenuInteraction<"cached">>;

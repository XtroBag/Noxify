import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  inlineCode,
} from "discord.js";
import {
  ComponentModule,
  ComponentTypes,
} from "../../../handler/types/Component";
import { Colors, Emojis } from "../../../config";

export = {
  id: "ASMChannels",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const originalUserID = extras[0];
    const selected = extras[1];

    if (button.member.id !== originalUserID) {
      await button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} This panel is reserved for <@${originalUserID}> to use.`
            ),
        ],
        ephemeral: true,
      });
    } else {
      const guild = await client.utils.getGuild(button.guildId);

      const channelNamesWithPermissions: string[] = [];
      const channelNamesMissingPermissions: string[] = [];

      for (const id of guild.autoSlowmode.channels) {
        const channel = await button.guild.channels.fetch(id);

        if (!channel) {
          channelNamesMissingPermissions.push(`Unknown Channel (${id})`);
          continue;
        }

        const permissions = channel.permissionsFor(client.user!);

        if (
          permissions?.has("ViewChannel") &&
          permissions?.has("SendMessages")
        ) {
          channelNamesWithPermissions.push(`${Emojis.Check} <#${channel.id}>`);
        } else {
          let missingPermissions = [];
          if (!permissions?.has("ViewChannel"))
            missingPermissions.push(inlineCode("ViewChannel"));
          if (!permissions?.has("SendMessages"))
            missingPermissions.push(inlineCode("SendMessages"));

          const missingPermissionsText = missingPermissions.length
            ? `${missingPermissions.join(" | ")}`
            : "Unknown issue with permissions.";

          channelNamesMissingPermissions.push(
            `${Emojis.Cross} <#${channel.id}> - ${missingPermissionsText}`
          );
        }
      }

      const embed = new EmbedBuilder()
        .setDescription(
          `**Channels with permissions:**\n` +
            (channelNamesWithPermissions.length
              ? channelNamesWithPermissions.join("\n")
              : "None") +
            `\n\n**Channels missing permissions:**\n` +
            (channelNamesMissingPermissions.length
              ? channelNamesMissingPermissions.join("\n")
              : "None")
        )
        .setColor(Colors.Normal);

      const menurow =
        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId(`ASMPicks|${originalUserID}|${selected}`)
            .setChannelTypes([ChannelType.GuildText])
            .setMinValues(1)
            .setMaxValues(25)
            .setPlaceholder("Select channels to enable ASM inside of them")
        );

      const buttonrow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`ASMConfigMenu|${originalUserID}|${selected}`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary)
      );

      await button.update({
        embeds: [embed],
        components: [menurow, buttonrow],
      });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler/types/Component";
import { Colors } from "../../config";

export = {
  id: "securityMenu",
  type: ComponentTypes.SelectMenu,
  async execute(client, menu, extras): Promise<void> {
    const selected = menu.values[0];

    if (selected === 'autoSlowmode') {

      const guild = await client.utils.getGuild(menu.guildId);

      const embed = new EmbedBuilder()
        .setDescription('Configure the settings for the AutoSlowmode system')
        .setColor(Colors.Normal)

      const row = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
          new ButtonBuilder()
            .setCustomId(`securityBack`)
            .setLabel('Back')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`autoslowmodeStatus`)
            .setLabel(guild.autoSlowmode.enabled ? 'Disable' : 'Enable')
            .setStyle(guild.autoSlowmode.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`autoslowmodeConfigurtion`)
            .setLabel('Configuration')
            .setDisabled(guild.autoSlowmode.enabled ? false : true)
            .setStyle(ButtonStyle.Primary)
        )

      await menu.update({ components: [row], embeds: [embed] });
    } else if (selected === 'antiCaps') {
      const embed = new EmbedBuilder()
        .setDescription('Configure the settings for the AntiCaps system')
        .setColor(Colors.Normal)

      const row = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
          new ButtonBuilder()
            .setCustomId(`securityBack`)
            .setLabel('Back')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`antiCapsConfigurtion`)
            .setLabel('Configuration')
            .setStyle(ButtonStyle.Primary)
        )

      await menu.update({ components: [row], embeds: [embed] });
    }
  },
} as ComponentModule<StringSelectMenuInteraction<"cached">>;

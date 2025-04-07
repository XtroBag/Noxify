import {
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../handler/types/Component";
import { Emojis, Colors } from "../../../config";

export = {
  id: "accountPrivacy",
  type: ComponentTypes.Button,
  async execute(client, button, params) {
    const userId = params.OrignalUserId
    const economy = await client.utils.getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    if (button.member.id !== person.userID) {
      button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `${Emojis.Info} This menu is for ${person.displayName}, so you cannot use it.`
            ),
        ],
        ephemeral: true,
      });
    } else {
      await button.deferUpdate();

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`accountPrivacyOptions|<OrignalUserId:${userId}>`)
          .setPlaceholder("Select permissions to enable")
          .setOptions([
            {
              label: `View Inventory`,
              value: `viewInventory`,
              description: "Allow users to check your inventory",
              emoji: Emojis.ViewInventory
            },
            {
              label: `Receive Notifications`,
              value: `receiveNotifications`,
              description: "Get Notifications of changes",
              emoji: Emojis.ReceiveNotifications
            },
          ])
          .setMaxValues(2)
      );

      const backbutton = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`accountBack|<OrignalUserId:${userId}>`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary)
      );

      await button.editReply({
        components: [row, backbutton],
        embeds: [
          new EmbedBuilder()
            .setTitle("Edit Permissions")
            .setDescription(`${Emojis.ViewInventory} View Inventory ${
                person.privacyOptions.viewInventory
                  ? Emojis.Check
                  : Emojis.Cross
              }\n${Emojis.ReceiveNotifications} Receive Notifications ${
                  person.privacyOptions.receiveNotifications
                    ? Emojis.Check
                    : Emojis.Cross
                }`
            )
            .setColor(Colors.Normal),
        ],
      });
    }
  },
} as ComponentModule<ButtonInteraction<'cached'>>;

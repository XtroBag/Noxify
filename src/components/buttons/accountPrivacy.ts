import {
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import {
  getEconomy,
  updateUserPermissions,
} from "../../handler/util/DatabaseCalls";
import { Emojis, Colors } from "../../config";

export = {
  id: "accountPrivacy",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">): Promise<void> {
    // Extract userID from customId
    const userId = button.customId.split("-")[1];
    const economy = await getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    // Ensure the member ID matches the userID for permissions
    if (button.member.id !== person.userID) {
      button.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `You're not able to use this menu, it's ${person.displayName}'s`
            ),
        ],
        ephemeral: true,
      });
    } else {
      // Defer the update immediately
      await button.deferUpdate();

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`accountPrivacyOptions-${userId}`)
          .setPlaceholder("Select permissions to enable")
          .setOptions([
            {
              label: "View Inventory",
              value: "viewInventory",
              description: "Allow users to check your inventory",
            },
            {
              label: "Receive Notifications",
              value: "receiveNotifications",
              description: "Get Notifications of changes",
            },
          ])
          .setMaxValues(2)
      );

      const backbutton = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`accountBack-${userId}`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary)
      );

      await button.editReply({
        components: [row, backbutton],
        embeds: [
          new EmbedBuilder()
            .setTitle("Edit Permissions")
            .setDescription(`View Inventory ${
                person.privacySettings.viewInventory
                  ? Emojis.Check
                  : Emojis.Cross
              }\nReceive Notifications ${
                  person.privacySettings.receiveNotifications
                    ? Emojis.Check
                    : Emojis.Cross
                }`
            )
            .setColor(Colors.Normal),
        ],
      });
    }
  },
} as ComponentModule;
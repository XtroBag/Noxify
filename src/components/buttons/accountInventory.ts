import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { getEconomy } from "../../handler/util/DatabaseCalls";
import { Colors } from "../../config";

export = {
  id: "accountInventory",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">): Promise<void> {
    const userId = button.customId.split("-")[1];

    // const userData = await button.guild.members.fetch({ user: userId });

    const economy = await getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    const canViewInventory = person?.privacySettings.viewInventory;

    if (button.member.id !== person.userID) {
      if (canViewInventory === false) {
        button.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `Due to ${person.displayName}'s privacy settings, you cannot view their inventory.`
              ),
          ],
          ephemeral: true,
        });
      } else if (canViewInventory === true) {
        await button.deferUpdate();
        await button.editReply({
          components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setCustomId(`accountBack-${userId}`)
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
          embeds: [
            new EmbedBuilder()
              .setDescription("This is the inventory")
              .setColor(Colors.Normal),
          ],
        });
      }
    } else {
      await button.deferUpdate();
      await button.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId(`accountBack-${userId}`)
              .setLabel("Back")
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
        embeds: [
          new EmbedBuilder()
            .setDescription("This is your inventory")
            .setColor(Colors.Normal),
        ],
      });
    }
  },
} as ComponentModule;

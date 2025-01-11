import {
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { Economy } from "../../handler/schemas/models/Models";
import { Colors } from "../../config";
import { getEconomy } from "../../handler/util/DatabaseCalls";

export = {
  id: "accept-swap",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const fromUserID = extras[0];
    const toUserID = extras[1];

    const economy = await getEconomy({ guildID: button.guildId });

    const fromUserData = economy.users.find(
      (user) => user.userID === fromUserID
    );
    const toUserData = economy.users.find((user) => user.userID === toUserID);

    if (!fromUserData || !toUserData) {
      return button.update({
        content: "One or both users could not be located.",
        components: [],
      });
    }

    if (!fromUserData || !toUserData) {
      return await button.update({
        content: "Unable to find user data in the database.",
        components: [],
      });
    }

    const fromUser = await button.guild.members.fetch(fromUserID);
    const toUser = await button.guild.members.fetch(toUserID);

    if (!fromUser || !toUser) {
      return await button.update({
        content: "One or both users could not be found in the server.",
        components: [],
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Account Swap Request")
      .setDescription(
        `**${fromUser.user.tag}** has requested to transfer their account data to **${toUser.user.tag}**. Will you accept the request?`
      )
      .setColor("#ffcc00")
      .setFooter({ text: `You can accept or decline the swap request.` });

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("accept-swap-to")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("deny-swap-to")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
    );

    try {
      const menuReply = await toUser.send({
        embeds: [embed],
        components: [actionRow],
      });

      const sentMessage = await button.update({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `A swap request has been sent to ${toUser.user.tag}. Please await their response.`
            )
            .setColor(Colors.Warning),
        ],
        components: [],
      });

      const collector = menuReply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 300000,
      });

      collector.on(
        "collect",
        async (menuInteraction: ButtonInteraction<"cached">) => {
          if (menuInteraction.customId === "accept-swap-to") {
            const economy = await getEconomy({ guildID: button.guildId });

            const fromUserInDb = economy.users.find(
              (user) => user.userID === fromUserData.userID
            );
            const toUserInDb = economy.users.find(
              (user) => user.userID === toUserData.userID
            );

            if (!fromUserInDb || !toUserInDb) {
              return menuInteraction.update({
                content:
                  "One or both users could not be found in the database during swap.",
                components: [],
              });
            }

            const fromUserBackup = {
              accountBalance: fromUserInDb.accountBalance,
              bankBalance: fromUserInDb.bankBalance,
              milestones: fromUserInDb.milestones,
              transactions: fromUserInDb.transactions,
              privacySettings: fromUserInDb.privacySettings,
              inventory: fromUserInDb.inventory
            };

            const toUserBackup = {
              accountBalance: toUserInDb.accountBalance,
              bankBalance: toUserInDb.bankBalance,
              milestones: toUserInDb.milestones,
              transactions: toUserInDb.transactions,
              privacySettings: toUserInDb.privacySettings,
              inventory: toUserInDb.inventory
            };

            // Swap data
            await Economy.updateOne(
              {
                guildID: button.guildId,
                "users.userID": toUserInDb.userID,
              },
              {
                $set: {
                  "users.$.accountBalance": fromUserBackup.accountBalance,
                  "users.$.bankBalance": fromUserBackup.bankBalance,
                  "users.$.milestones": fromUserBackup.milestones,
                  "users.$.transactions": fromUserBackup.transactions,
                  "users.$.privacySettings": fromUserBackup.privacySettings,
                  "users.$.inventory:": fromUserBackup.inventory,
                },
              }
            );

            await Economy.updateOne(
              {
                guildID: button.guildId,
                "users.userID": fromUserInDb.userID,
              },
              {
                $set: {
                  "users.$.accountBalance": toUserBackup.accountBalance,
                  "users.$.bankBalance": toUserBackup.bankBalance,
                  "users.$.milestones": toUserBackup.milestones,
                  "users.$.transactions": toUserBackup.transactions,
                  "users.$.privacySettings": toUserBackup.privacySettings,
                  "users.$.inventory:": toUserBackup.inventory
                },
              }
            );

            await sentMessage.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The account swap request has been successfully completed between ${fromUser.displayName} and ${toUser.displayName}.`
                  )
                  .setColor(Colors.Success),
              ],
              components: [],
            });

            await menuReply.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `Your account has been successfully swapped with ${fromUser.displayName}.`
                  )
                  .setColor(Colors.Success),
              ],
              components: [],
            });

            collector.stop();
            await menuInteraction.deferUpdate();
          } else if (menuInteraction.customId === "deny-swap-to") {
            await sentMessage.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `${toUser.displayName} has declined the swap request.`
                  )
                  .setColor(Colors.Error),
              ],
              components: [],
            });

            await menuReply.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`You have declined the swap request.`)
                  .setColor(Colors.Error),
              ],
              components: [],
            });

            collector.stop();
            await menuInteraction.deferUpdate();
          }
        }
      );

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          await sentMessage.edit({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `${toUser.user.tag} did not respond in time. The swap request has expired.`
                )
                .setColor(Colors.Error),
            ],
            components: [],
          });
        }
      });
    } catch (error) {
      console.error(`Error sending swap request: ${error.message}`);
      return button.update({
        content: `Failed to send the swap request to ${toUser.user.tag}. They may have DMs disabled.`,
        components: [],
      });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

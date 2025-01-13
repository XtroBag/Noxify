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

export = {
  id: "accept-swap",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const fromUserID = extras[0];
    const toUserID = extras[1];

    await button.deferUpdate();

    // const economy = await getEconomy({ guildID: button.guildId });

    // const fromUserData = economy.users.find(
    //   (user) => user.userID === fromUserID
    // );
    // const toUserData = economy.users.find((user) => user.userID === toUserID);

    // if (!fromUserData || !toUserData) {
    //   return button.update({
    //     content: "One or both users could not be located.",
    //     components: [],
    //   });
    // }


    // const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    //   new ButtonBuilder()
    //     .setCustomId("accept-swap-to")
    //     .setLabel("Accept")
    //     .setStyle(ButtonStyle.Success),
    //   new ButtonBuilder()
    //     .setCustomId("deny-swap-to")
    //     .setLabel("Decline")
    //     .setStyle(ButtonStyle.Danger)
    // );

    // // Send the initial message in the channel (not private)
    // const swapRequestMsg = await button.channel.send({
    //   embeds: [
    //     new EmbedBuilder()
    //       .setDescription(
    //         `A swap request has been sent to ${toUserData.displayName}. Please await their response.`
    //       )
    //       .setColor(Colors.Warning),
    //   ],
    //   components: [actionRow],
    // });

    // try {
    //   // Collector for button interactions
    //   const collector = button.channel.createMessageComponentCollector({
    //     componentType: ComponentType.Button,
    //     time: 300000, // 5 minutes timeout
    //   });

    //   collector.on(
    //     "collect",
    //     async (menuInteraction: ButtonInteraction<"cached">) => {
    //       // Allow only the toUser to interact with the buttons
    //       if (menuInteraction.user.id !== toUserID) {
    //         return menuInteraction.reply({
    //           content: "You are not authorized to interact with these buttons.",
    //           ephemeral: true, // Prevent others from interacting
    //         });
    //       }

    //       if (menuInteraction.customId === "accept-swap-to") {
    //         const economy = await getEconomy({ guildID: button.guildId });

    //         const fromUserInDb = economy.users.find(
    //           (user) => user.userID === fromUserData.userID
    //         );
    //         const toUserInDb = economy.users.find(
    //           (user) => user.userID === toUserData.userID
    //         );

    //         if (!fromUserInDb || !toUserInDb) {
    //           return menuInteraction.reply({
    //             content:
    //               "One or both users could not be found in the database during swap.",
    //             ephemeral: false,
    //           });
    //         }

    //         const fromUserBackup = {
    //           accountBalance: fromUserInDb.accountBalance,
    //           bankBalance: fromUserInDb.bankBalance,
    //           milestones: fromUserInDb.milestones,
    //           transactions: fromUserInDb.transactions,
    //           privacySettings: fromUserInDb.privacySettings,
    //           inventory: fromUserInDb.inventory,
    //         };

    //         const toUserBackup = {
    //           accountBalance: toUserInDb.accountBalance,
    //           bankBalance: toUserInDb.bankBalance,
    //           milestones: toUserInDb.milestones,
    //           transactions: toUserInDb.transactions,
    //           privacySettings: toUserInDb.privacySettings,
    //           inventory: toUserInDb.inventory,
    //         };

    //         // Swap data in the database
    //         await Economy.updateOne(
    //           {
    //             guildID: button.guildId,
    //             "users.userID": toUserInDb.userID,
    //           },
    //           {
    //             $set: {
    //               "users.$.accountBalance": fromUserBackup.accountBalance,
    //               "users.$.bankBalance": fromUserBackup.bankBalance,
    //               "users.$.milestones": fromUserBackup.milestones,
    //               "users.$.transactions": fromUserBackup.transactions,
    //               "users.$.privacySettings": fromUserBackup.privacySettings,
    //               "users.$.inventory": fromUserBackup.inventory,
    //             },
    //           }
    //         );

    //         await Economy.updateOne(
    //           {
    //             guildID: button.guildId,
    //             "users.userID": fromUserInDb.userID,
    //           },
    //           {
    //             $set: {
    //               "users.$.accountBalance": toUserBackup.accountBalance,
    //               "users.$.bankBalance": toUserBackup.bankBalance,
    //               "users.$.milestones": toUserBackup.milestones,
    //               "users.$.transactions": toUserBackup.transactions,
    //               "users.$.privacySettings": toUserBackup.privacySettings,
    //               "users.$.inventory": toUserBackup.inventory,
    //             },
    //           }
    //         );

    //         // Notify both users publicly in the channel
    //         await swapRequestMsg.edit({
    //           embeds: [
    //             new EmbedBuilder()
    //               .setDescription(
    //                 `The account swap request has been successfully completed between ${fromUserData.displayName} and ${toUserData.displayName}.`
    //               )
    //               .setColor(Colors.Success),
    //           ],
    //           components: [], // Disable the buttons
    //         });

    //         await button.channel.send({
    //           embeds: [
    //             new EmbedBuilder()
    //               .setDescription(
    //                 `Your account has been successfully swapped with ${fromUserData.displayName}.`
    //               )
    //               .setColor(Colors.Success),
    //           ],
    //         });

    //         collector.stop();
    //       } else if (menuInteraction.customId === "deny-swap-to") {
    //         // If declined
    //         await menuInteraction.reply({
    //           content: `${toUserData.displayName} has declined the swap request.`,
    //           ephemeral: false, // Public response in channel
    //         });

    //         await swapRequestMsg.edit({
    //           embeds: [
    //             new EmbedBuilder()
    //               .setDescription(
    //                 `The swap request has been declined by ${toUserData.displayName}.`
    //               )
    //               .setColor(Colors.Error),
    //           ],
    //           components: [], // Disable the buttons
    //         });

    //         collector.stop();
    //       }
    //     }
    //   );

    //   collector.on("end", async (collected, reason) => {
    //     if (reason === "time") {
    //       await swapRequestMsg.edit({
    //         embeds: [
    //           new EmbedBuilder()
    //             .setDescription(
    //               `${toUserData.displayName} did not respond in time. The swap request has expired.`
    //             )
    //             .setColor(Colors.Error),
    //         ],
    //         components: [], // Disable the buttons
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error(`Error processing swap request: ${error.message}`);
    // }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

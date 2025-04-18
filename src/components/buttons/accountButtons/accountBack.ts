import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../handler/types/Component";
import { Colors, Emojis } from "../../../config";
import { EconomyUser } from "../../../handler/types/economy/EconomyUser";

export = {
  id: "accountBack",
  type: ComponentTypes.Button,
  async execute(client, button, params) {
    const userId = params.OrignalUserId;

    const userData = await button.guild.members.fetch({ user: userId });

    const economy = await client.utils.getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);
    const canViewInventory = person?.privacyOptions.viewInventory;

    const getTotalBalance = (user: EconomyUser): number =>
      user.bankingAccounts.wallet + user.bankingAccounts.bank;

    const leaderboard = economy.users.sort((a, b) => {
      const totalA = getTotalBalance(a);
      const totalB = getTotalBalance(b);
      return totalB - totalA;
    });

    const searchedUserIndex = leaderboard.findIndex(
      (user) => user.displayName === person.displayName
    );

    const rank = searchedUserIndex !== -1 ? searchedUserIndex + 1 : "Not found";

    const bankingInformation = new EmbedBuilder()
      .setAuthor({
        name: `${userData.user.username}'s Profile`,
        iconURL: userData.displayAvatarURL({ extension: "png" }),
      })
      .setDescription(
        `${Emojis.Joined} Joined: ${person.joined.toDateString()}\n` +
        `${Emojis.Transactions} Transactions: ${inlineCode(person.transactions.length.toString())}\n` +
        `${Emojis.ActiveEffects} Active Effects: ${inlineCode(person.effects.length.toString())}\n` +
        `${Emojis.Leaderboard} Leaderboard Rank: ${inlineCode(`#${rank}`)}\n` + 
        `${Emojis.Health} Health: ${inlineCode(person.health.toString())}\n`
      )
      .setFields([
        {
          name: `${Emojis.Bank} **Bank**`,
          value: `${client.utils.formatNumber(
            person.bankingAccounts.bank
          )} ${economy.icon}`,
          inline: true,
        },
        {
          name: `${Emojis.Wallet} **Wallet**`,
          value: `${client.utils.formatNumber(
            person.bankingAccounts.wallet
          )} ${economy.icon}`,
          inline: true,
        },
      ])
      .setColor(Colors.Normal);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accountRefresh|<OrignalUserId:${userId}>`)
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`accountInventory|<OrignalUserId:${userId}>`)
        .setLabel("Inventory")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`accountPrivacy|<OrignalUserId:${userId}>`)
        .setLabel("Privacy")
        .setStyle(ButtonStyle.Danger)
    );

    if (button.member.id !== person.userID) {
      if (canViewInventory === false) {
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
        await button.editReply({
          embeds: [bankingInformation],
          components: [row],
        });
      }
    } else {
      await button.deferUpdate();
      await button.editReply({
        embeds: [bankingInformation],
        components: [row],
      });
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

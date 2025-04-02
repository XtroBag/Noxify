import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../handler/types/Component";
import { Colors, Emojis, milestones } from "../../../config";
import { EconomyUser } from "src/handler/types/economy/EconomyUser";

export = {
  id: "accountRefresh",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const userId = extras[0];

    const userData = await button.guild.members.fetch({ user: userId });

    const economy = await client.utils.getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    if (button.member.id !== userId) {
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
      if (!economy) {
        await button.reply({
          content: "This server does not have an Economy system set up yet.",
          ephemeral: true,
        });
        return;
      }

      const user = economy.users.find((user) => user.userID === userId);
      if (!user) {
        await button.reply({
          content: "User not found in the economy system.",
          ephemeral: true,
        });
        return;
      }

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

      const rank =
        searchedUserIndex !== -1 ? searchedUserIndex + 1 : "Not found";

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

      const isSearchingOwnAccount = button.user.id === userId;

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`accountRefresh|${userId}`)
          .setLabel("Refresh")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!isSearchingOwnAccount),
        new ButtonBuilder()
          .setCustomId(`accountInventory|${userId}`)
          .setLabel("Inventory")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`accountPrivacy|${userId}`)
          .setLabel("Privacy")
          .setStyle(ButtonStyle.Danger)
      );

      let milestoneReached = false;
      let milestone = null;

      for (const m of milestones) {
        const milestoneReachedAlready = user.milestones.some(
          (milestone) => milestone.amount === m && milestone.finished === true
        );

        if (
          user.bankingAccounts.bank + user.bankingAccounts.wallet >= m &&
          !milestoneReachedAlready
        ) {
          milestone = m;

          await client.utils.addMilestoneToUser({
            guildID: button.guildId,
            userID: userId,
            milestone: {
              amount: m,
              finished: true,
              recieved: new Date().toDateString(),
            },
          });

          milestoneReached = true;
          break;
        }
      }

      await button.update({
        embeds: [bankingInformation],
        components: [row],
      });

      if (
        milestoneReached &&
        milestone !== null &&
        user.privacyOptions.receiveNotifications
      ) {
        await button.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Normal)
              .setTitle("Congrats, you hit a new Milestone 🎉")
              .setDescription(
                `${userMention(
                  person.userID
                )} you reached a milestone of **${client.utils.formatNumber(
                  milestone
                )}** ${economy.name.toLowerCase().replace(/s$/, "")}${
                  milestone !== 1 || economy.name.toLowerCase().endsWith("s")
                    ? "s"
                    : ""
                }`
              ),
          ],
        });
      }
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

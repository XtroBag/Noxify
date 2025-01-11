import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  userMention,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { format, parse } from "date-fns";
import {
  getEconomy,
  formatAmount,
  updateUserMilestones,
} from "../../handler/util/DatabaseCalls";
import { Colors, Emojis, milestones } from "../../config";

export = {
  id: "accountRefresh",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const userId = extras[0];

    const userData = await button.guild.members.fetch({ user: userId });

    const economy = await getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    if (button.member.id !== userId) {
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

      const parsedDate = parse(
        user.joined,
        "EEEE, MMMM d, yyyy 'at' h:mm a",
        new Date()
      );
      const timestampInSeconds = Math.floor(parsedDate.getTime() / 1000);
      const discordTimestamp = `<t:${timestampInSeconds}:D>`;

      const leaderboard = economy.users.sort(
        (a, b) =>
          b.accountBalance + b.bankBalance - (a.accountBalance + a.bankBalance)
      );

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
          `${Emojis.Joined} Joined: ${discordTimestamp}\n` +
            `${Emojis.Transactions} Transactions: ${person.transactions.length}\n` +
            `${Emojis.ActiveEffects} Active Effects: ${person.activeEffects.length}\n` +
            `${Emojis.Leaderboard} Leaderboard Rank: #${rank}\n`
        )
        .setFields([
          {
            name: `${Emojis.Bank} **Bank Balance**`,
            value: `${formatAmount(person.bankBalance)} ${economy.icon}`,
            inline: true,
          },
          {
            name: `${Emojis.Wallet} **Wallet Balance**`,
            value: `${formatAmount(person.accountBalance)} ${economy.icon}`,
            inline: true,
          },
        ])
        .setColor(Colors.Normal)
        .setFooter({
          text: `Noxify`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

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

      // Milestone Check Logic
      let milestoneReached = false;
      let milestone = null;

      for (const m of milestones) {
        const milestoneReachedAlready = user.milestones.some(
          (milestone) => milestone.amount === m && milestone.finished === true
        );

        if (
          user.bankBalance + user.accountBalance >= m &&
          !milestoneReachedAlready
        ) {
          milestone = m;

          await updateUserMilestones({
            guildID: button.guildId,
            userID: userId,
            milestone: {
              amount: m,
              finished: true,
              reachedAt: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
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
        user.privacySettings.receiveNotifications
      ) {
        await button.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Normal)
              .setTitle("Congrats, you hit a new Milestone 🎉")
              .setDescription(
                `${userMention(
                  person.userID
                )} you reached a milestone of **${formatAmount(
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

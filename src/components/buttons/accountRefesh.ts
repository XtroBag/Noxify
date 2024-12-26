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
  isEmojiFormatValid,
} from "../../handler/util/DatabaseCalls";
import { Colors, milestones } from "../../config";

export = {
  id: "accountRefresh",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">): Promise<void> {
    const userId = button.customId.split("-")[1];

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

      const bankBalanceFormatted = isEmojiFormatValid(economy.icon)
        ? `${economy.icon} ${formatAmount(person.bankBalance)}`
        : `${economy.icon}${formatAmount(person.bankBalance)}`;

      const walletBalanceFormatted = isEmojiFormatValid(economy.icon)
        ? `${economy.icon} ${formatAmount(person.accountBalance)}`
        : `${economy.icon}${formatAmount(person.accountBalance)}`;

      const bankingInformation = new EmbedBuilder()
        .setDescription(
          `Joined: ${discordTimestamp}\nTransactions: ${person.transactions.length}`
        )
        .setAuthor({
          name: userData.user.username,
          iconURL: userData.displayAvatarURL({ extension: "png" }),
        })
        .setFields([
          {
            name: "Bank",
            value: bankBalanceFormatted,
            inline: true,
          },
          {
            name: "Wallet",
            value: walletBalanceFormatted,
            inline: true,
          },
        ])
        .setColor(Colors.Normal);

      const isSearchingOwnAccount = button.user.id === userId;

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`accountRefresh-${userId}`)
          .setLabel("Refresh")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!isSearchingOwnAccount),
        new ButtonBuilder()
          .setCustomId(`accountInventory-${userId}`)
          .setLabel("Inventory")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`accountPrivacy-${userId}`)
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
} as ComponentModule;

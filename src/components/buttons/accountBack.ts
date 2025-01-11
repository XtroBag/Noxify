import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import {
  formatAmount,
  getEconomy,
} from "../../handler/util/DatabaseCalls";
import { Colors, Emojis } from "../../config";
import { parse } from "date-fns";

export = {
  id: "accountBack",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const userId = extras[0];

    const userData = await button.guild.members.fetch({ user: userId });

    const economy = await getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);
    const canViewInventory = person?.privacySettings.viewInventory;

    const parsedDate = parse(
      person.joined,
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

    const rank = searchedUserIndex !== -1 ? searchedUserIndex + 1 : "Not found";

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

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accountRefresh|${userId}`)
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`accountInventory|${userId}`)
        .setLabel("Inventory")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`accountPrivacy|${userId}`)
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
                `You're not able to use this menu, it's ${person.displayName}'s`
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

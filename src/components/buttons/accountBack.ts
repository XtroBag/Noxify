import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { formatAmount, getEconomy, isEmojiFormatValid } from "../../handler/util/DatabaseCalls";
import { Colors } from "../../config";
import { parse } from "date-fns";

export = {
  id: "accountBack",
  type: ComponentTypes.Button,
  async execute(client, button: ButtonInteraction<"cached">): Promise<void> {
    const userId = button.customId.split("-")[1];

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

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accountRefresh-${userId}`)
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`accountInventory-${userId}`)
        .setLabel("Inventory")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`accountPrivacy-${userId}`)
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
} as ComponentModule;

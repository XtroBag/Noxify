import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler/types/Command";
import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { Colors, Emojis } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription(
      "Transfer an amount from your Bank to your Wallet, or vice versa. "
    )
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption((data) =>
      data
        .setName("from")
        .setDescription("Where you want to take the currency from.")
        .addChoices([
          { name: "Bank", value: "bank" },
          { name: "Wallet", value: "wallet" },
        ])
        .setRequired(true)
    )
    .addStringOption((data) =>
      data
        .setName("to")
        .setDescription("Where you want to send currency.")
        .addChoices([
          { name: "Bank", value: "bank" },
          { name: "Wallet", value: "wallet" },
        ])
        .setRequired(true)
    )
    .addNumberOption((data) =>
      data
        .setName("amount")
        .setDescription("The amount you want to transfer.")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute({ client, interaction }) {
    const from = interaction.options.getString("from");
    const to = interaction.options.getString("to");

    const economy = await client.utils.getEconomy({ guildID: interaction.guildId });

    if (from === to) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `${Emojis.Info} You cannot transfer ${economy.name} to the same account.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!economy) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} This server does not have an Economy system set up yet.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    let user = economy.users.find(
      (user) => user.userID === interaction.member.id
    );
    if (!user) {
      await client.utils.addUserToEconomy({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        joined: new Date(),
        displayName: interaction.member.displayName,
        bankingAccounts: {
            wallet: economy.defaultBalance,
            bank: 0
        },
        privacyOptions: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: {  meals: [], weapons: [], drinks: [], ingredients: [], ammos: [], },
        effects: []
      });
      user = economy.users.find(
        (user) => user.userID === interaction.member.id
      );
    }

    const amount = interaction.options.getNumber("amount");

    if (from === "bank" && to === "wallet") {
      if (user.bankingAccounts.bank < amount) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `${Emojis.Info} You do not have enough ${economy.name.toLowerCase().replace(/s$/, "")}${
                  amount === 1 ? "" : "s"
                } in your bank account to transfer ${client.utils.formatNumber(amount)}.`
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      user.bankingAccounts.bank -= amount;
      user.bankingAccounts.wallet += amount;

      client.utils.setWalletBalance({ guildID: interaction.guildId, userID: interaction.member.id, amount: user.bankingAccounts.wallet });
      client.utils.setBankBalance({ guildID: interaction.guildId, userID: interaction.member.id, amount: user.bankingAccounts.bank });

      const transactionDescription = `Transferred ${client.utils.formatNumber(
        amount
      )} ${economy.name.toLowerCase().replace(/s$/, "")}${
        amount === 1 ? "" : "s"
      } from bank to wallet`;

      await client.utils.addTransaction({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        transaction: {
          type: "Transfer",
          description: transactionDescription,
          amount: amount,
          time: new Date(),
        },
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Success)
            .setDescription(
              `${Emojis.Check} Sent ${client.utils.formatNumber(amount)} ${economy.name
                .toLowerCase()
                .replace(/s$/, "")}${
                amount === 1 ? "" : "s"
              } from your bank to your wallet.`
            ),
        ],
      });
    } else if (from === "wallet" && to === "bank") {
      if (user.bankingAccounts.wallet < amount) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `${Emojis.Info} You do not have enough ${economy.name
                  .toLowerCase()
                  .replace(/s$/, "")}${
                  amount === 1 ? "" : "s"
                } in your wallet to transfer ${client.utils.formatNumber(amount)}.`
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      user.bankingAccounts.wallet -= amount;
      user.bankingAccounts.bank += amount;

      client.utils.setWalletBalance({ guildID: interaction.guildId, userID: interaction.member.id, amount: user.bankingAccounts.wallet });
      client.utils.setBankBalance({ guildID: interaction.guildId, userID: interaction.member.id, amount: user.bankingAccounts.bank });

      const transactionDescription = `Transferred ${client.utils.formatNumber(
        amount
      )} ${economy.name
        .toLowerCase()
        .replace(/s$/, "")}${
        amount === 1 ? "" : "s"
      } from wallet to bank`;

      await client.utils.addTransaction({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        transaction: {
          type: "Transfer",
          description: transactionDescription,
          amount: amount,
          time: new Date(),
        },
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Success)
            .setDescription(
              `Sent ${client.utils.formatNumber(amount)} ${economy.name
                .toLowerCase()
                .replace(/s$/, "")}${
                amount === 1 ? "" : "s"
              } from your wallet to your bank.`
            ),
        ],
      });
    }
  },
} as SlashCommandModule;

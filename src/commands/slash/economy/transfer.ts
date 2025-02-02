import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { format } from "date-fns";
import { Colors } from "../../../config";

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

    const economy = await client.utils.calls.getEconomy({ guildID: interaction.guildId });

    if (from === to) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `You cannot transfer ${economy.name} to the same account.`
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
              `This server does not have an Economy system set up yet.`
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
      await client.utils.calls.addEconomyUser({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        displayName: interaction.member.displayName,
        accountBalance: economy.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: { items: { meal: [], weapon: [], drink: [], ingredient: [] }},
        activeEffects: []
      });
      user = economy.users.find(
        (user) => user.userID === interaction.member.id
      );
    }

    const amount = interaction.options.getNumber("amount");

    if (from === "bank" && to === "wallet") {
      if (user.bankBalance < amount) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `You do not have enough ${
                  economy.name
                } in your bank account to transfer ${client.utils.extras.formatAmount(amount)}.`
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      user.bankBalance -= amount;
      user.accountBalance += amount;

      await client.utils.calls.updateBalances({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        accountBalance: user.accountBalance,
        bankBalance: user.bankBalance,
      });

      const transactionDescription = `Transferred ${client.utils.extras.formatAmount(
        amount
      )} ${economy.name.toLowerCase().replace(/s$/, "")}${
        amount === 1 ? "" : "s"
      } from bank to wallet`;

      await client.utils.calls.addTransaction({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        transaction: {
          type: "transfer",
          description: transactionDescription,
          amount: amount,
          time: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        },
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Success)
            .setDescription(
              `Sent ${client.utils.extras.formatAmount(amount)} ${economy.name
                .toLowerCase()
                .replace(/s$/, "")}${
                amount === 1 ? "" : "s"
              } from your bank to your wallet.`
            ),
        ],
      });
    } else if (from === "wallet" && to === "bank") {
      if (user.accountBalance < amount) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `You do not have enough ${
                  economy.name
                } in your wallet to transfer ${client.utils.extras.formatAmount(amount)}.`
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      user.accountBalance -= amount;
      user.bankBalance += amount;

      await client.utils.calls.updateBalances({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        accountBalance: user.accountBalance,
        bankBalance: user.bankBalance,
      });

      const transactionDescription = `Transferred ${client.utils.extras.formatAmount(
        amount
      )} from wallet to bank`;
      await client.utils.calls.addTransaction({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        transaction: {
          type: "transfer",
          description: transactionDescription,
          amount: amount,
          time: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        },
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Success)
            .setDescription(
              `Sent ${client.utils.extras.formatAmount(amount)} ${economy.name
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

import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ApplicationIntegrationType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import { format } from "date-fns";
import { Colors } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay or transfer money between users.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addUserOption((data) =>
      data
        .setName("member")
        .setDescription("The member to transfer money to.")
        .setRequired(true)
    )
    .addNumberOption((data) =>
      data
        .setName("amount")
        .setDescription("The amount of money to transfer.")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute({ client, interaction }) {
    const member =
      interaction.options.getMember("member") ?? interaction.member;
    const amount = interaction.options.getNumber("amount");

    if (member.user.bot) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`You are not able to interact with apps`),
        ],
        ephemeral: true,
      });
      return;
    }

    if (amount % 1 !== 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              "Decimals are not allowed. Please provide a whole number."
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    const economyData = await client.utils.calls.getEconomy({
      guildID: interaction.guildId,
    });

    if (member.id === interaction.member.id) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `You cannot send ${economyData.name.toLowerCase()} to yourself.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!economyData) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `It looks like this server hasn't set up the Economy system yet.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    let economyUsers = economyData.users;

    let user = economyUsers.find(
      (economyUser) => economyUser.userID === interaction.member.id
    );
    if (!user) {
      await client.utils.calls.addEconomyUser({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        displayName: interaction.member.displayName,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        accountBalance: economyData.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: {
          items: { meal: [], weapon: [], drink: [], ingredient: [] },
        },
        activeEffects: [],
      });

      const updatedEconomyData = await client.utils.calls.getEconomy({
        guildID: interaction.guildId,
      });

      economyUsers = updatedEconomyData?.users;
      user = economyUsers.find(
        (economyUser) => economyUser.userID === interaction.member.id
      );
    }

    const recipient = economyUsers.find((user) => user.userID === member.id);
    if (!recipient) {
      await client.utils.calls.addEconomyUser({
        guildID: interaction.guildId,
        userID: member.id,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        displayName: member.displayName,
        accountBalance: economyData.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: {
          items: { meal: [], weapon: [], drink: [], ingredient: [] },
        },
        activeEffects: [],
      });
    }

    const updatedEconomy = await client.utils.calls.getEconomy({
      guildID: interaction.guildId,
    });

    let updatedUsers = updatedEconomy.users;

    const updatedSender = updatedUsers.find(
      (user) => user.userID === interaction.member.id
    );
    const updatedRecipient = updatedUsers.find(
      (user) => user.userID === member.id
    );

    if (!updatedSender || !updatedRecipient) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `An error occurred while updating the user accounts.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (updatedSender.accountBalance < amount) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(`Insufficient funds.`),
        ],
        ephemeral: true,
      });
      return;
    }

    updatedSender.accountBalance -= amount;
    updatedRecipient.accountBalance += amount;

    await client.utils.calls.updateUserBalancesAndTransactions({
      guildID: interaction.guildId,
      amount: amount,
      economy: economyData,
      updatedSender: updatedSender,
      updatedRecipient: updatedRecipient,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Success)
          .setDescription(
            `Successfully transferred ${client.utils.extras.formatAmount(
              amount
            )} ${economyData.name.toLowerCase().replace(/s$/, "")}${
              amount === 1 ? "" : "s"
            } to ${member.displayName}.`
          ),
      ],
    });
  },
} as SlashCommandModule;

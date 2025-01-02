import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonInteraction,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { Colors } from "../../../config";
import { getEconomy, addEconomyUser, convertTimeToDiscordTimestamp } from "../../../handler/util/DatabaseCalls";
import { format } from "date-fns";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("transactions")
    .setDescription("Check personal transactions")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  async execute({ client, interaction }) {
    await interaction.deferReply({ ephemeral: true });

    const economyData = await getEconomy({ guildID: interaction.guildId });

    if (!economyData) {
      await interaction.reply({
        content:
          "It looks like this server hasn't set up the Economy system yet. Please contact an admin to enable it.",
        ephemeral: true,
      });
      return;
    }

    let user = economyData.users.find(
      (economyUser) => economyUser.userID === interaction.member.id
    );

    if (!user) {
      await addEconomyUser({
        guildID: interaction.guildId,
        displayName: interaction.member.displayName,
        userID: interaction.member.id,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        accountBalance: economyData.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: false, viewInventory: false },
        milestones: [],
        transactions: [],
      });

      const updatedEconomyData = await getEconomy({
        guildID: interaction.guildId,
      });
      user = updatedEconomyData?.users.find(
        (economyUser) => economyUser.userID === interaction.member.id
      );
    }

    const userTransactions = user?.transactions || [];

    if (userTransactions.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Banking Transactions")
        .setDescription("No transactions found.")
        .setColor(Colors.Normal);

      await interaction.followUp({
        ephemeral: true,
        embeds: [embed],
        components: [],
      });
      return;
    }

    let currentPageIndex = 0;
    const transactionsPerPage = 5;
    const totalPages = Math.ceil(userTransactions.length / transactionsPerPage);

    const startTransactionIndex = currentPageIndex * transactionsPerPage;
    const endTransactionIndex = startTransactionIndex + transactionsPerPage;
    const transactionsForCurrentPage = userTransactions
      .slice(startTransactionIndex, endTransactionIndex)
      .map((transaction) => {
        return `**Description:** ${transaction.description || "No description"}
        **Type:** ${transaction.type}
        **Amount:** ${transaction.amount || "No amount"}
        **Time:** ${convertTimeToDiscordTimestamp(transaction.time)}`;
      })
      .join("\n\n");

    const pageInfo = `Page ${currentPageIndex + 1} of ${totalPages}`;

    const embed = new EmbedBuilder()
      .setTitle("Banking Transactions")
      .setDescription(`${transactionsForCurrentPage}\n\n${pageInfo}`)
      .setColor(Colors.Normal);

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(`transactions_back_page_${currentPageIndex - 1}`)
        .setLabel("⇽")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPageIndex === 0),
      new ButtonBuilder()
        .setCustomId(`transactions_forward_page_${currentPageIndex + 1}`)
        .setLabel("⇾")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPageIndex === totalPages - 1)
    );

    const message = await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });

    const filter = (i: ButtonInteraction<"cached">) =>
      i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({
      filter,
      time: 120000,
    });

    collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
      await buttonInteraction.deferUpdate();

      const customId = buttonInteraction.customId;
      let newPageIndex = currentPageIndex;

      // Update page index based on the button clicked
      if (customId.startsWith("transactions_back_page_")) {
        newPageIndex = Math.max(0, currentPageIndex - 1);
      } else if (customId.startsWith("transactions_forward_page_")) {
        newPageIndex = Math.min(totalPages - 1, currentPageIndex + 1);
      }

      // Update the page index globally
      currentPageIndex = newPageIndex;

      // Update the transaction list for the new page
      const startIdx = currentPageIndex * transactionsPerPage;
      const endIdx = startIdx + transactionsPerPage;
      const transactionsForNewPage = userTransactions
        .slice(startIdx, endIdx)
        .map((transaction) => {
          return `**Description:** ${
            transaction.description || "No description"
          }
          **Type:** ${transaction.type}
          **Amount:** ${transaction.amount || "No amount"}
          **Time:** ${convertTimeToDiscordTimestamp(transaction.time)}`;
        })
        .join("\n\n");

      const newPageInfo = `Page ${currentPageIndex + 1} of ${totalPages}`;

      // Create a new embed with updated content
      const updatedEmbed = new EmbedBuilder()
        .setTitle("Banking Transactions")
        .setDescription(
          `${transactionsForNewPage || "No transactions found."}\n\n${newPageInfo}`
        )
        .setColor(Colors.Normal);

      // Update the buttons for the new page
      const updatedRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(
            `transactions_back_page_${Math.max(0, currentPageIndex - 1)}`
          )
          .setLabel("⇽")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(currentPageIndex === 0),
        new ButtonBuilder()
          .setCustomId(
            `transactions_forward_page_${Math.min(
              totalPages - 1,
              currentPageIndex + 1
            )}`
          )
          .setLabel("⇾")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(currentPageIndex === totalPages - 1)
      );

      // Edit the message with the updated embed and buttons
      await buttonInteraction.editReply({
        embeds: [updatedEmbed],
        components: [updatedRow],
      });
    });

    collector.on("end", async (collected) => {
      const first = collected.first();
      if (!first) return;

      await first.editReply({
        components: [],
      });
    });
  },
} as SlashCommandModule;

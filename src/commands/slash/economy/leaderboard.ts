import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler/types/Command";
import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { Colors } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check the server's most top richest members.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute({ client, interaction }) {
    const economyData = await client.utils.getEconomy({ guildID: interaction.guildId });

    if (!economyData) {
      await interaction.reply({
        content:
          "It looks like this server hasn't set up the Economy system yet. Please contact an admin to enable it.",
        ephemeral: true,
      });
      return;
    }

    let economyUsers = economyData.users;

    let user = economyUsers.find(
      (economyUser) => economyUser.userID === interaction.member.id
    );

    if (!user) {
      await client.utils.addUserToEconomy({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        displayName: interaction.member.displayName,
        joined: new Date(),
        bankingAccounts: {
            wallet: economyData.defaultBalance,
            bank: 0
        },
        privacyOptions: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: { meals: [], weapons: [], drinks: [], ingredients: [], ammos: [], },
        effects: []
      });

      const updatedEconomyData = await client.utils.getEconomy({
        guildID: interaction.guildId,
      });

      economyUsers = updatedEconomyData?.users;
      user = economyUsers.find(
        (economyUser) => economyUser.userID === interaction.member.id
      );
    }

    const leaderboard = economyUsers
    .sort(
      (a, b) =>
        b.bankingAccounts.wallet + b.bankingAccounts.bank - (a.bankingAccounts.wallet + a.bankingAccounts.bank)
    )
    .slice(0, 10);
  
  if (leaderboard.length === 0) {
    await interaction.reply({
      content: "No users found on the leaderboard.",
      ephemeral: true,
    });
    return;
  }

  const leaderboardDescription = leaderboard
  .map((user, index) => {
    const icon = economyData.icon;
    const formattedAmount = client.utils.formatNumber(user.bankingAccounts.wallet + user.bankingAccounts.bank);

    return `${index + 1}. **${user.displayName}** ${formattedAmount} ${icon}`;
  })
  .join("\n");
  
  const leaderboardEmbed = new EmbedBuilder()
    .setTitle("Leaderboard - Top Members")
    .setDescription(leaderboardDescription)
    .setColor(Colors.Normal);

    await interaction.reply({
      embeds: [leaderboardEmbed],
    });
  },
} as SlashCommandModule;

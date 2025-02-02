import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { Colors } from "../../../config";
import { format } from "date-fns";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check the server's most top richest members.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute({ client, interaction }) {
    const economyData = await client.utils.calls.getEconomy({ guildID: interaction.guildId });

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
        inventory: { items: { meal: [], weapon: [], drink: [], ingredient: [] }},
        activeEffects: []
      });

      const updatedEconomyData = await client.utils.calls.getEconomy({
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
        b.accountBalance + b.bankBalance - (a.accountBalance + a.bankBalance)
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
    const formattedAmount = client.utils.extras.formatAmount(user.accountBalance + user.bankBalance);

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

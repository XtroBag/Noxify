import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler/types/Command";
import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { Colors, Emojis } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  cooldown: 86400, // 1 day (in seconds)
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("collect a daily amount")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute({ client, interaction }) {
    const economy = await client.utils.getEconomy({ guildID: interaction.guildId });

    if (!economy) {
      await interaction.reply({
        content: "This server does not have an Economy system set up yet.",
        ephemeral: true,
      });
      return;
    }

    const exists = economy.users.find(
      (user) => user.userID === interaction.member.id
    );

    if (!exists) {
      await client.utils.addUserToEconomy({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        displayName: interaction.member.displayName,
        joined: new Date(),
        bankingAccounts: {
            wallet: economy.defaultBalance,
            bank: 0
        },
        privacyOptions: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: { meals: [], weapons: [], drinks: [], ingredients: [] },
        effects: []
      });
    }

    const updatedEconomy = await client.utils.getEconomy({ guildID: interaction.guildId });
    const user = updatedEconomy.users.find(
      (user) => user.userID === interaction.member.id
    );

    const gained = Math.floor(Math.random() * 270) + 1;

    const newBankBalance = user.bankingAccounts.bank + gained;

    await client.utils.setSavingsBalance({
      guildID: interaction.guildId,
      userID: interaction.member.id,
      amount: newBankBalance,
    });

    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(Colors.Success).setDescription(`${Emojis.Check} You collected you're daily amount of ${gained} ${economy.name
        .toLowerCase()
        .replace(/s$/, "")}${
        gained === 1 ? "" : "s"
      }`)]
    });
  },
} as SlashCommandModule;

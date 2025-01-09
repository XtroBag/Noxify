import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import { getEconomy } from "../../../handler/util/DatabaseCalls";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("food")
    .setDescription(
      "Use food items from your inventory to restore health or gain buffs."
    )
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eat")
        .setDescription("Eat a food item to restore health or energy.")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The food item you want to eat.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("drink")
        .setDescription("Drink a beverage to restore hydration or gain buffs.")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The drink item you want to consume.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async execute({ client, interaction }) {
    const economy = await getEconomy({ guildID: interaction.guildId });

    if (!economy) {
      await interaction.reply({
        content: "This server does not have an Economy system set up yet.",
        ephemeral: true,
      });
      return;
    }

    const user = economy.users.find(
      (user) => user.userID === interaction.member.id
    );
  },
} as SlashCommandModule;

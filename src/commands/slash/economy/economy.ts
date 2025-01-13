import { Colors, Emojis, validCurrencySymbols } from "../../../config";
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

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("economy")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Set up the economy system for your server")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription(
              "Choose a name for the economy system (example: 'Gems', 'Dollars', 'Coins')"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("symbol")
            .setDescription(
              "Select a symbol for the economy (example: $, €, ¥, or an emoji)"
            )
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("default")
            .setDescription(
              "Set the default starting balance for new users in the economy (example: 100, 275)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete you're servers economy.")
    )
    .setDescription("Setup an economy for the server")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute({ client, interaction }) {
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "setup") {
      const economyName = interaction.options.getString("name");
      const economySymbol = interaction.options.getString("symbol");
      const defaultBalance = interaction.options.getNumber("default");

      // Fetch the current economy setup for the server
      const existingEconomy = await client.utils.calls.getEconomy({
        guildID: interaction.guildId,
      });

      if (existingEconomy) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `${Emojis.Info} This server already has an economy system set up.`
              ),
          ],
          ephemeral: true,
        });
      }

      if (
        validCurrencySymbols.includes(economySymbol) || client.utils.extras.isServerEmojiValid(economySymbol, interaction)
      ) {
        const newEconomy = await client.utils.calls.createEconomy({
          guildID: interaction.guildId,
          name: economyName.charAt(0).toUpperCase() + economyName.slice(1),
          icon: economySymbol,
          defaultBalance: defaultBalance,
          users: [],
        });

        if (newEconomy) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Success)
                .setDescription(
                  `${Emojis.Check} Successfully set up the economy system`
                ),
            ],
          });
        } else {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `There was an error setting up the economy system. Please try again.`
                ),
            ],
            ephemeral: true,
          });
        }
      } else {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription(
                `${Emojis.Cross} Invalid currency symbol. Please use a valid symbol like $, €, ¥, or an emoji.`
              ),
          ],
          ephemeral: true,
        });
      }
    } else if (subcommand === "delete") {
      const deleted = await client.utils.calls.deleteEconomy(interaction.guildId);

      if (deleted) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Success)
              .setDescription(
                `${Emojis.Check} Successfully deleted the economy`
              ),
          ],
        });
      }
    }
  },
} as SlashCommandModule;

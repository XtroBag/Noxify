import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
  AutocompleteInteraction,
  EmbedBuilder,
  inlineCode,
} from "discord.js";
import { Economy } from "../../../handler/schemas/models/Models";
import {
  Meal,
  RequiredIngredient,
} from "src/handler/types/economy/EconomyItem";
import { Colors, Emojis } from "../../../config";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("cook")
    .setDescription("Cook food with the ingredients")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption((option) =>
      option
        .setName("meal")
        .setDescription("The meal you want to cook")
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async execute({ client, interaction }) {
    const economy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

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

    const userlookup = economy.users.find(
      (economyUser) => economyUser.userID === interaction.member.id
    );

    if (!userlookup) {
      await client.utils.addUserToEconomy({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        displayName: interaction.member.displayName,
        joined: new Date(),
        bankingAccounts: {
          wallet: economy.defaultBalance,
          bank: 0,
        },
        privacyOptions: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: {
          meals: [],
          weapons: [],
          drinks: [],
          ingredients: [],
          ammos: [],
        },
        effects: [],
      });
    }

    const updatedEconomy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

    const user = updatedEconomy.users.find(
      (economyUser) => economyUser.userID === interaction.member.id
    );

    const selectedMeal = interaction.options.getString("meal");
    const selectedMealData = client.utils
      .getItemsByType("meals")
      .find((meal) => meal.name.singular === selectedMeal);

    if (!selectedMealData) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} Sorry, the selected meal does not exist.`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    const missingIngredients: string[] = [];
    const updatedIngredients: RequiredIngredient[] = [];

    for (const ingredient of selectedMealData.ingredientsRequired) {
      const amountOwned = user.inventory.ingredients.filter(
        (item) => item.name.singular === ingredient.name
      ).length;

      if (amountOwned < ingredient.amountNeeded) {
        const missingAmount = ingredient.amountNeeded - amountOwned;
        missingIngredients.push(
          inlineCode(`${ingredient.name} x${missingAmount}`)
        );
      } else {
        updatedIngredients.push({
          name: ingredient.name,
          amountNeeded: ingredient.amountNeeded,
        });
      }
    }

    if (missingIngredients.length > 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `${
                Emojis.Info
              } You are missing the following ingredients to cook ${
                selectedMealData.name.singular
              }:\n${missingIngredients.join(" ")}`
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    selectedMealData.ingredientsRequired.forEach(async (ingredient) => {
      const ingredientIndex = user.inventory.ingredients.findIndex(
        (userIngredient) => userIngredient.name.singular === ingredient.name
      );

      if (ingredientIndex !== -1) {
        user.inventory.ingredients.splice(
          ingredientIndex,
          ingredient.amountNeeded
        );
      }
    });

    const mealToAdd: Meal = {
      name: {
        singular: selectedMealData.name.singular,
        plural: selectedMealData.name.plural,
      },
      description: selectedMealData.description,
      shopType: "meals",
      price: selectedMealData.price,
      disabled: selectedMealData.disabled,
      effects: selectedMealData.effects,
      icon: selectedMealData.icon,
      amountPerUser: selectedMealData.amountPerUser,
      ingredientsRequired: selectedMealData.ingredientsRequired,
    };

    client.utils.addMealToInventory({
      guildID: interaction.guildId,
      userID: interaction.member.id,
      meal: mealToAdd,
      item: user.inventory.ingredients,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Success)
          .setDescription(
            `${Emojis.Check} Successfully cooked ${selectedMealData.name.singular}!`
          ),
      ],
      ephemeral: true,
    });
  },

  async autocomplete(interaction: AutocompleteInteraction, client) {
    const focusedValue = interaction.options.getString("meal") || "";
    const economy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

    if (!economy) {
      return;
    }

    const meals = client.utils.getItemsByType("meals");

    const mealslist = meals.filter((meal) =>
      meal.name.singular.toLowerCase().includes(focusedValue.toLowerCase())
    );

    await interaction.respond(
      mealslist.map((meal) => ({
        name: meal.name.singular,
        value: meal.name.singular,
      }))
    );
  },
} as SlashCommandModule;

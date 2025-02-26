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
import {
  Meal,
  RequiredIngredient,
} from "../../../handler/types/economy/EconomyItem";
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
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How many of this meal do you want to cook?")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(50)
    ),

  async execute({ client, interaction }) {
    let selectedMeal = interaction.options.getString("meal");

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
        health: 100,
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

    const capitalizeWords = (str: string): string => {
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };

    selectedMeal = capitalizeWords(selectedMeal);

    const quantity = interaction.options.getInteger("amount");

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

      const requiredAmount = ingredient.amountNeeded * quantity;

      if (amountOwned < requiredAmount) {
        const missingAmount = requiredAmount - amountOwned;
        missingIngredients.push(
          inlineCode(`${ingredient.name} x${missingAmount}`)
        );
      } else {
        updatedIngredients.push({
          name: ingredient.name,
          amountNeeded: requiredAmount,
        });
      }
    }

    if (missingIngredients.length > 0) {
      const mealName =
        quantity > 1
          ? selectedMealData.name.plural
          : selectedMealData.name.singular;
      const mealAmountText = quantity > 1 ? `**${quantity}** ` : "a ";
    
      let ingredientsText = "";
      let chunkSize = 4;
      let chunkCount = Math.ceil(missingIngredients.length / chunkSize);
    
      for (let i = 0; i < chunkCount; i++) {
        let chunk = missingIngredients.slice(i * chunkSize, (i + 1) * chunkSize);
        ingredientsText += `${Emojis.Blank} ${chunk.join(" ")}\n`;
      }
    
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Warning)
            .setDescription(
              `${Emojis.Info} You’re missing these ingredients to cook ${mealAmountText}${mealName}\n${ingredientsText}`
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
          ingredient.amountNeeded * quantity
        );
      }
    });

    await client.utils.addMealToInventory({
      guildID: interaction.guildId,
      userID: interaction.member.id,
      items: user.inventory.ingredients,
      quantity: quantity,
      meal: {
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
      },
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Success)
          .setDescription(
            `${Emojis.Check} Successfully cooked ${selectedMealData.name.singular} (x${quantity})!`
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

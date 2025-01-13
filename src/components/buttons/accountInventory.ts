import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { getEconomy } from "../../handler/util/DatabaseCalls";
import { Colors, Emojis } from "../../config";
import { Items, UserEconomy } from "../../handler/types/Database";

export = {
  id: "accountInventory",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const userId = extras[0];

    const economy = await getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    const canViewInventory = person?.privacySettings.viewInventory;

    if (button.member.id !== person.userID) {
      if (canViewInventory === false) {
        button.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `Due to ${person.displayName}'s privacy settings, you cannot view their inventory.`
              ),
          ],
          ephemeral: true,
        });
      } else if (canViewInventory === true) {
        await displayInventory(button, person, userId);
      }
    } else {
      await displayInventory(button, person, userId);
    }
  },
} as ComponentModule<ButtonInteraction<'cached'>>;

async function displayInventory(button: ButtonInteraction<'cached'>, person: UserEconomy, userId: string) {
  // Retrieve weapon, meal, ingredient, and drink items from the user's inventory
  const weapons = person.inventory.items.weapon.filter(item => item.type === "weapon");
  const meals = person.inventory.items.food.filter(item => item.type === "meal");
  const ingredients = person.inventory.items.ingredient.filter(item => item.type === "ingredient");
  const drinks = person.inventory.items.drink.filter(item => item.type === "drink");

  // Function to group items and count quantities
  const groupItemsByName = (items: Items[]) => {
    const groupedItems: { [key: string]: any[] } = {};
    items.forEach(item => {
      if (!groupedItems[item.name.singular]) {
        groupedItems[item.name.singular] = [];
      }
      groupedItems[item.name.singular].push(item);
    });
    return groupedItems;
  };

  // Group weapons, meals, ingredients, and drinks separately
  const groupedWeapons = groupItemsByName(weapons);
  const groupedMeals = groupItemsByName(meals);
  const groupedIngredients = groupItemsByName(ingredients);
  const groupedDrinks = groupItemsByName(drinks);

  let inventoryDescription = "";

  // Function to get the correct item name based on quantity
  const getItemName = (itemName: string, itemPluralName: string, quantity: number): string => {
    return quantity > 1 ? itemPluralName : itemName;
  };

  // Show weapons
  if (Object.keys(groupedWeapons).length > 0) {
    inventoryDescription += `${Emojis.Weapons} **Weapons**:\n`;
    for (const [name, items] of Object.entries(groupedWeapons)) {
      const quantity = items.length;
      const item = items[0]; // Assuming the name is consistent for all items of this type
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`; // Default to plural if no explicit plural form exists

      // Get the correct item name based on quantity
      const itemNamePluralized = getItemName(itemName, itemPluralName, quantity);

      // If there's more than 1, show quantity
      if (quantity > 1) {
        inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
      } else {
        inventoryDescription += `› ${itemNamePluralized}\n`; // Just show name if only 1 item
      }
    }
  } else {
    inventoryDescription += `${Emojis.Weapons} **Weapons**: None\n`;
  }

  // Show meals
  if (Object.keys(groupedMeals).length > 0) {
    inventoryDescription += `\n${Emojis.Meals} **Meals**:\n`;
    for (const [name, items] of Object.entries(groupedMeals)) {
      const quantity = items.length;
      const item = items[0]; // Assuming the name is consistent for all items of this type
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`; // Default to plural if no explicit plural form exists

      // Get the correct item name based on quantity
      const itemNamePluralized = getItemName(itemName, itemPluralName, quantity);

      // If there's more than 1, show quantity
      if (quantity > 1) {
        inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
      } else {
        inventoryDescription += `› ${itemNamePluralized}\n`; // Just show name if only 1 item
      }
    }
  } else {
    inventoryDescription += `${Emojis.Meals} **Meals**: None\n`;
  }

  // Show ingredients
  if (Object.keys(groupedIngredients).length > 0) {
    inventoryDescription += `\n${Emojis.Ingredients} **Ingredients**:\n`;
    for (const [name, items] of Object.entries(groupedIngredients)) {
      const quantity = items.length;
      const item = items[0]; // Assuming the name is consistent for all items of this type
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`; // Default to plural if no explicit plural form exists

      // Get the correct item name based on quantity
      const itemNamePluralized = getItemName(itemName, itemPluralName, quantity);

      // If there's more than 1, show quantity
      if (quantity > 1) {
        inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
      } else {
        inventoryDescription += `› ${itemNamePluralized}\n`; // Just show name if only 1 item
      }
    }
  } else {
    inventoryDescription += `${Emojis.Ingredients} **Ingredients**: None\n`;
  }

  // Show drinks
  if (Object.keys(groupedDrinks).length > 0) {
    inventoryDescription += `\n${Emojis.Drinks} **Drinks**:\n`;
    for (const [name, items] of Object.entries(groupedDrinks)) {
      const quantity = items.length;
      const item = items[0]; // Assuming the name is consistent for all items of this type
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`; // Default to plural if no explicit plural form exists

      // Get the correct item name based on quantity
      const itemNamePluralized = getItemName(itemName, itemPluralName, quantity);

      // If there's more than 1, show quantity
      if (quantity > 1) {
        inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
      } else {
        inventoryDescription += `› ${itemNamePluralized}\n`; // Just show name if only 1 item
      }
    }
  } else {
    inventoryDescription += `${Emojis.Drinks} **Drinks**: None\n`;
  }

  // Create the embed with the inventory
  await button.deferUpdate();
  await button.editReply({
    components: [
      new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setCustomId(`accountBack|${userId}`)
          .setLabel("Back")
          .setStyle(ButtonStyle.Secondary)
      ),
    ],
    embeds: [
      new EmbedBuilder()
        .setTitle(`${person.displayName}'s Inventory`)
        .setDescription(inventoryDescription || "No items in inventory.")
        .setColor(Colors.Normal),
    ],
  });
}

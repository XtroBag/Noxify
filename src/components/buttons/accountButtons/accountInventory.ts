import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../handler/types/Component";
import { Colors, Emojis } from "../../../config";
import { EconomyUser } from "../../../handler/types/economy/EconomyUser";
import { Items } from "../../../handler/types/economy/EconomyItem";

export = {
  id: "accountInventory",
  type: ComponentTypes.Button,
  async execute(client, button, extras) {
    const userId = extras[0];

    const economy = await client.utils.getEconomy({ guildID: button.guildId });
    const person = economy.users.find((user) => user.userID === userId);

    const canViewInventory = person?.privacyOptions.viewInventory;

    if (button.member.id !== person.userID) {
      if (canViewInventory === false) {
        button.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription(
                `${Emojis.Cross} Due to ${person.displayName}'s privacy options, their inventory is not visible to you.`
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
} as ComponentModule<ButtonInteraction<"cached">>;

async function displayInventory(
  button: ButtonInteraction<"cached">,
  person: EconomyUser,
  userId: string
) {
  const weapons = person.inventory.weapons.filter(
    (item) => item.shopType === "weapons"
  );
  const meals = person.inventory.meals.filter(
    (item) => item.shopType === "meals"
  );
  const ingredients = person.inventory.ingredients.filter(
    (item) => item.shopType === "ingredients"
  );
  const drinks = person.inventory.drinks.filter(
    (item) => item.shopType === "drinks"
  );
  const ammos = person.inventory.ammos.filter(
    (item) => item.shopType === "ammos"
  );

  const groupItemsByName = (items: Items[]) => {
    const groupedItems: { [key: string]: any[] } = {};
    items.forEach((item) => {
      if (!groupedItems[item.name.singular]) {
        groupedItems[item.name.singular] = [];
      }
      groupedItems[item.name.singular].push(item);
    });
    return groupedItems;
  };

  const groupedWeapons = groupItemsByName(weapons);
  const groupedMeals = groupItemsByName(meals);
  const groupedIngredients = groupItemsByName(ingredients);
  const groupedDrinks = groupItemsByName(drinks);
  const groupedAmmos = groupItemsByName(ammos);

  let inventoryDescription = "";

  const getItemName = (
    itemName: string,
    itemPluralName: string,
    quantity: number
  ): string => {
    return quantity > 1 ? itemPluralName : itemName;
  };

  // Show ingredients
  if (Object.keys(groupedIngredients).length > 0) {
    inventoryDescription += `${Emojis.Ingredients} **Ingredients**:\n`;
    for (const [name, items] of Object.entries(groupedIngredients)) {
      const quantity = items.length;
      const item = items[0];
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`;

      const itemNamePluralized = getItemName(
        itemName,
        itemPluralName,
        quantity
      );

      inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
    }
  } else {
    inventoryDescription += `${Emojis.Ingredients} **Ingredients**: None\n`;
  }

  // Show drinks
  if (Object.keys(groupedDrinks).length > 0) {
    inventoryDescription += `${Emojis.Drinks} **Drinks**:\n`;
    for (const [name, items] of Object.entries(groupedDrinks)) {
      const quantity = items.length;
      const item = items[0];
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`;

      const itemNamePluralized = getItemName(
        itemName,
        itemPluralName,
        quantity
      );

      inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
    }
  } else {
    inventoryDescription += `${Emojis.Drinks} **Drinks**: None\n`;
  }

  // Show meals
  if (Object.keys(groupedMeals).length > 0) {
    inventoryDescription += `${Emojis.Meals} **Meals**:\n`;
    for (const [name, items] of Object.entries(groupedMeals)) {
      const quantity = items.length;
      const item = items[0];
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`;

      const itemNamePluralized = getItemName(
        itemName,
        itemPluralName,
        quantity
      );

      inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
    }
  } else {
    inventoryDescription += `${Emojis.Meals} **Meals**: None\n`;
  }

  // Show weapons
  if (Object.keys(groupedWeapons).length > 0) {
    inventoryDescription += `${Emojis.Weapons} **Weapons**:\n`;
    for (const [name, items] of Object.entries(groupedWeapons)) {
      const quantity = items.length;
      const item = items[0];
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`;

      const itemNamePluralized = getItemName(
        itemName,
        itemPluralName,
        quantity
      );

      inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
    }
  } else {
    inventoryDescription += `${Emojis.Weapons} **Weapons**: None\n`;
  }

  // Show ammos (New section)
  if (Object.keys(groupedAmmos).length > 0) {
    inventoryDescription += `${Emojis.Ammo} **Ammos**:\n`;  // Assuming you have an Emojis.Ammos
    for (const [name, items] of Object.entries(groupedAmmos)) {
      const quantity = items.length;
      const item = items[0];
      const itemName = item.name.singular;
      const itemPluralName = item.name.plural || `${itemName}s`;

      const itemNamePluralized = getItemName(
        itemName,
        itemPluralName,
        quantity
      );

      inventoryDescription += `› ${itemNamePluralized} x${quantity}\n`;
    }
  } else {
    inventoryDescription += `${Emojis.Ammo} **Ammos**: None\n`;  // Assuming you have an Emojis.Ammos
  }

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

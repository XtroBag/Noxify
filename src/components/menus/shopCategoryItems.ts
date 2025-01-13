import {
  StringSelectMenuInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { ItemType } from "../../handler/types/Item";
import { WeaponData, Items, IngredientData, MealData, DrinkData } from "../../handler/types/Database";
import { Colors } from "../../config";
import { formatAmount, getEconomy } from "../../handler/util/DatabaseCalls";
import { getItemsByType } from "../../handler/util/Items";

// Add a generic type parameter to getPaginatedItems
const getPaginatedItems = <T extends Items>(items: T[], pageIndex: number, itemsPerPage: number) => {
  items.sort((a, b) => a.name.singular.localeCompare(b.name.singular));
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);
  return { currentItems, totalPages };
};

export = {
  id: "shopCategoryItems",
  type: ComponentTypes.SelectMenu,
  async execute(client, menu, extras) {
    const itemsPerPage = Number(extras[0]);
    const pageIndex = Number(extras[1]);
    const selectedType = menu.values[0] as ItemType;

    const economy = await getEconomy({ guildID: menu.guildId });

    // Handle weapon items
    if (selectedType === "weapon") {
      const selectedItems = getItemsByType(client, "weapon") as WeaponData[];
      const { currentItems: weaponItems, totalPages } = getPaginatedItems(selectedItems, pageIndex, itemsPerPage);

      const weaponDescriptions = weaponItems.map((item) => {
        let itemDescription = `\n${item.icon} **${item.name.singular}** - Price: ${inlineCode(formatAmount(item.price))} ${economy.icon}`;

        itemDescription += `\n› Damage: ${inlineCode(item.damage.toString())} ❘ Durability: ${inlineCode(
          item.durability === "unlimited" ? "unlimited" : item.durability.toString()
        )} ❘ Type: ${inlineCode(item.weaponType)} ❘ Requires: ${
          item.requires && item.requires.length > 0
            ? item.requires.map((reqItem) => inlineCode(reqItem)).join(" ")
            : inlineCode("none")
        }`;

        // Check if description exists, if not set it to "No description available."
        itemDescription += `\n-# ➜ ${item.description || "No description available."}`;

        return itemDescription;
      });

      await menu.update({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Weapons")
            .setDescription(weaponDescriptions.length ? weaponDescriptions.join("\n") : "No items available"),
        ],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`shopCategoryItems|${itemsPerPage}|${0}`)
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder("Pick a category")
              .addOptions([
                { label: "Meals", value: "meal" },
                { label: "Weapons", value: "weapon" },
                { label: "Drinks", value: "drink" },
                { label: "Ingredients", value: "ingredient" },
              ])
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("«")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === 0),
            new ButtonBuilder()
              .setCustomId(`shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("»")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex >= totalPages - 1)
          ),
        ],
      });
    }
    // Handle meal items
    else if (selectedType === "meal") {
      const selectedItems = getItemsByType(client, "meal") as MealData[];
      const { currentItems: mealItems, totalPages } = getPaginatedItems(selectedItems, pageIndex, itemsPerPage);

      const mealDescriptions = mealItems.map((item) => {
        let itemDescription = `\n${item.icon} **${item.name.singular}** - Price: ${inlineCode(formatAmount(item.price))} ${economy.icon}`;

        itemDescription += `\n› Ingredients: ${item.ingredientsRequired && item.ingredientsRequired.length > 0
          ? item.ingredientsRequired.map((ingredient) => inlineCode(ingredient)).join(" ")
          : inlineCode("none")
        }`;

        // Check if description exists, if not set it to "No description available."
        itemDescription += `\n-# ➜ ${item.description || "No description available."}`;

        return itemDescription;
      });

      await menu.update({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Meals")
            .setDescription(mealDescriptions.length ? mealDescriptions.join("\n") : "No items available"),
        ],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`shopCategoryItems|${itemsPerPage}|${0}`)
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder("Pick a category")
              .addOptions([
                { label: "Meals", value: "meal" },
                { label: "Weapons", value: "weapon" },
                { label: "Drinks", value: "drink" },
                { label: "Ingredients", value: "ingredient" },
              ])
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("«")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === 0),
            new ButtonBuilder()
              .setCustomId(`shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("»")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex >= totalPages - 1)
          ),
        ],
      });
    }
    // Handle drink items
    else if (selectedType === "drink") {
      const selectedItems = getItemsByType(client, "drink") as DrinkData[];
      const { currentItems: drinkItems, totalPages } = getPaginatedItems(selectedItems, pageIndex, itemsPerPage);

      const drinkDescriptions = drinkItems.map((item) => {
        let itemDescription = `\n${item.icon} **${item.name.singular}** - Price: ${inlineCode(formatAmount(item.price))} ${economy.icon}`;

        // Check if description exists, if not set it to "No description available."
        itemDescription += `\n-# ➜ ${item.description || "No description available."}`;

        return itemDescription;
      });

      await menu.update({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Drinks")
            .setDescription(drinkDescriptions.length ? drinkDescriptions.join("\n") : "No items available"),
        ],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`shopCategoryItems|${itemsPerPage}|${0}`)
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder("Pick a category")
              .addOptions([
                { label: "Meals", value: "meal" },
                { label: "Weapons", value: "weapon" },
                { label: "Drinks", value: "drink" },
                { label: "Ingredients", value: "ingredient" },
              ])
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("«")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === 0),
            new ButtonBuilder()
              .setCustomId(`shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("»")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex >= totalPages - 1)
          ),
        ],
      });
    }
    // Handle ingredient items
    else if (selectedType === "ingredient") {
      const selectedItems = getItemsByType(client, "ingredient") as IngredientData[];
      const { currentItems: ingredientItems, totalPages } = getPaginatedItems(selectedItems, pageIndex, itemsPerPage);

      const ingredientDescriptions = ingredientItems.map((item) => {
        let itemDescription = `\n${item.icon} **${item.name.singular}** - Price: ${inlineCode(formatAmount(item.price))} ${economy.icon}`;

        // Check if description exists, if not set it to "No description available."
        itemDescription += `\n-# ➜ ${item.description || "No description available."}`;

        return itemDescription;
      });

      await menu.update({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setTitle("Ingredients")
            .setDescription(ingredientDescriptions.length ? ingredientDescriptions.join("\n") : "No items available"),
        ],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`shopCategoryItems|${itemsPerPage}|${0}`)
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder("Pick a category")
              .addOptions([
                { label: "Meals", value: "meal" },
                { label: "Weapons", value: "weapon" },
                { label: "Drinks", value: "drink" },
                { label: "Ingredients", value: "ingredient" },
              ])
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("«")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === 0),
            new ButtonBuilder()
              .setCustomId(`shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`)
              .setLabel("»")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex >= totalPages - 1)
          ),
        ],
      });
    }
  },
} as ComponentModule<StringSelectMenuInteraction<"cached">>;


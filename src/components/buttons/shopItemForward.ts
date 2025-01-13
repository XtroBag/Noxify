import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";
import { Items } from "../../handler/types/Database";
import { ItemType } from "../../handler/types/Item";
import { Colors } from "../../config";
import { getItemsByType } from "../../handler/util/Items";
import { formatAmount, getEconomy } from "../../handler/util/DatabaseCalls";

export = {
  id: `shopItemForward`,
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    let pageIndex = Number(extras[0]);
    const itemsPerPage = Number(extras[1]);
    const selectedType = extras[2] as ItemType;

    const economy = await getEconomy({ guildID: interaction.guildId });

    let selectedItems: Items[];

    // Updated item type filtering to include meals, drinks, and ingredients
    if (selectedType === "weapon") {
      selectedItems = getItemsByType(client, "weapon");
    } else if (selectedType === "meal") {
      selectedItems = getItemsByType(client, "meal");
    } else if (selectedType === "drink") {
      selectedItems = getItemsByType(client, "drink");
    } else if (selectedType === "ingredient") {
      selectedItems = getItemsByType(client, "ingredient");
    } else {
      selectedItems = [];
    }

    selectedItems.sort((a, b) => a.name.singular.localeCompare(b.name.singular));

    const totalPages = Math.ceil(selectedItems.length / itemsPerPage);

    // Increment the page index when "Next" button is clicked
    pageIndex = Math.min(pageIndex + 1, totalPages - 1); // Prevent going beyond total pages

    const currentItems = selectedItems.slice(
      pageIndex * itemsPerPage,
      (pageIndex + 1) * itemsPerPage
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setTitle(
        `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Items`
      );

    const itemDescriptions = currentItems.map((item) => {
      let itemDescription = `\n${item.icon} **${item.name.singular}** - Price: ${inlineCode(formatAmount(item.price))} ${economy.icon}`;

      // Additional checks for items based on their type
      if (selectedType === "weapon" && "damage" in item) {
        itemDescription += `\n› Damage: ${inlineCode(item.damage.toString())} ❘ Durability: ${inlineCode(item.durability.toString())} ❘ Type: ${inlineCode(item.weaponType)} ❘ Requires: ${
          item.requires && item.requires.length > 0
            ? item.requires.map((reqItem) => inlineCode(reqItem)).join(" ")
            : inlineCode("none")
        }`;
      }

      if (selectedType === "drink" && "drinkable" in item) {
        itemDescription += `\n› Drinkable: ${inlineCode(item.drinkable ? "yes" : "no")}`;
      }

      if (selectedType === "ingredient" && "ingredientsRequired" in item) {
        // Map ingredients and list them in inlineCode with a space between each
        const ingredients = (item as any).ingredientsRequired.map((ingredient: string) => inlineCode(ingredient)).join(" ");
        itemDescription += `\n› Ingredients Required: ${ingredients || inlineCode("none")}`;
      }

      itemDescription += `\n-# ➜ ${item.description || "No description available."}`;

      return itemDescription;
    });

    if (selectedItems.length === 0) {
      embed.setDescription("No items available in this category.");
    } else {
      embed.setDescription(itemDescriptions.join("\n"));
    }

    await interaction.update({
      embeds: [embed],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`shopCategoryItems|${itemsPerPage}|${0}`)
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Pick a category")
            .addOptions([
              { label: "Foods", value: "meal" },
              { label: "Weapons", value: "weapon" },
              { label: "Drinks", value: "drink" }, // Added drinks category
              { label: "Ingredients", value: "ingredient" }, // Added ingredients category
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
            .setDisabled(pageIndex >= totalPages - 1) // Disable "Next" if we're on the last page
        ),
      ],
    });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

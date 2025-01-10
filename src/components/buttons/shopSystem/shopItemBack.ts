import {
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  inlineCode,
  StringSelectMenuBuilder,
} from "discord.js";
import { ComponentModule, ComponentTypes } from "../../../handler";
import { ItemType } from "../../../handler/types/Item";
import { Items } from "../../../handler/types/Database";
import { Colors } from "../../../config";
import { getItemsByType } from "../../../handler/util/Items";
import { getEconomy } from "../../../handler/util/DatabaseCalls";

export = {
  id: `shopItemBack`,
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    let pageIndex = Number(extras[0]);
    const itemsPerPage = Number(extras[1]);
    const selectedType = extras[2] as ItemType;

    const economy = await getEconomy({ guildID: interaction.guildId });

    // Adjust pageIndex for "Back" button
    pageIndex = Math.max(pageIndex - 1, 0);

    // Get selected items based on the item type
    let selectedItems: Items[];

    if (selectedType === "weapon") {
      selectedItems = getItemsByType(client, 'weapon');
    } else if (selectedType === "food") {
      selectedItems = getItemsByType(client, 'food');
    } else {
      selectedItems = [];
    }

    // Sort items alphabetically by name
    selectedItems.sort((a, b) => a.name.singular.localeCompare(b.name.singular));

    const totalPages = Math.ceil(selectedItems.length / itemsPerPage);
    const currentItems = selectedItems.slice(
      pageIndex * itemsPerPage,
      (pageIndex + 1) * itemsPerPage
    );

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setTitle(`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Items`);

    // Prepare the descriptions for the items
    const itemDescriptions = currentItems.map((item) => {
      let itemDescription = `\n${item.icon} **${item.name.singular}** - Price: ${inlineCode(item.price.toString())} ${economy.icon}`;

      if ("damage" in item) {
        itemDescription += `\n› Damage: ${inlineCode(
          item.damage.toString()
        )} ❘ Durability: ${inlineCode(
          item.durability.toString()
        )} ❘ Type: ${inlineCode(item.weaponType)} ❘ Requires: ${
          item.requires && item.requires.length > 0
            ? item.requires.map((reqItem) => inlineCode(reqItem)).join(' ')
            : inlineCode("none")
        }`;
      }

      if ("drinkable" in item) {
        itemDescription += `\n› Drinkable: ${inlineCode(item.drinkable ? "yes" : "no")} ❘ Effects: ${
          item.effects && item.effects.length > 0
            ? item.effects.map((effect) => inlineCode(effect.name)).join(" ")
            : inlineCode("none")
        }`;
      }

      itemDescription += `\n-# ➜ ${item.description || "No description available."}`;

      return itemDescription;
    });

    // If no items exist, show a message
    if (selectedItems.length === 0) {
      embed.setDescription("No items available in this category.");
    } else {
      embed.setDescription(itemDescriptions.join("\n"));
    }

    // Pagination buttons
    const row = new ActionRowBuilder<ButtonBuilder>();

    const previousButton = new ButtonBuilder()
      .setCustomId(`shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`)
      .setLabel("«")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0);

    const nextButton = new ButtonBuilder()
      .setCustomId(`shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`)
      .setLabel("»")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex >= totalPages - 1);

    row.addComponents(previousButton, nextButton);

    // Category selection menu
    const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`shopCategoryItems|${itemsPerPage}|${0}`)
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Pick a category")
        .addOptions([
          { label: "Foods", value: "food" },
          { label: "Weapons", value: "weapon" },
        ])
    );

    // Update the interaction
    await interaction.update({
      embeds: [embed],
      components: [menuRow, row],
    });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

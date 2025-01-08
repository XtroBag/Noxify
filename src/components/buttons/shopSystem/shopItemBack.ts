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

export = {
  id: `shopItemBack`,
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    let pageIndex = Number(extras[0]);
    const itemsPerPage = Number(extras[1]);
    const selectedType = extras[2] as ItemType;

    pageIndex = Math.max(pageIndex - itemsPerPage, 0);

    let selectedItems: Items[];

    if (selectedType === "weapon") {
      selectedItems = Array.from(client.items.weapon.values()).filter(
        (item) => !item.disabled
      );
    } else if (selectedType === "food") {
      selectedItems = Array.from(client.items.food.values()).filter(
        (item) => !item.disabled
      );
    } else {
      selectedItems = [];
    }

    const totalPages = Math.ceil(selectedItems.length / itemsPerPage);
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
      let itemDescription = `${item.icon} **${
        item.name
      }** - Price: ${inlineCode(item.price.toString())}`;

      if ("damage" in item) {
        itemDescription += `\n› Damage: ${inlineCode(
          item.damage.toString()
        )} ❘ Durability: ${inlineCode(
          item.durability.toString()
        )} ❘ Type: ${inlineCode(item.weaponType)}`;
      }
      if ("drinkable" in item) {
        itemDescription += `\n› Drinkable: ${inlineCode(
          item.drinkable ? "yes" : "no"
        )} ❘ Effects: ${
          item.effects && item.effects.length > 0
            ? item.effects.map((effect) => inlineCode(effect)).join(" ")
            : "None"
        }`;
      }

      itemDescription += `\n-# ➜ ${
        item.description || "No description available."
      }`;

      return itemDescription;
    });

    if (selectedItems.length === 0) {
      embed.setDescription("No items available in this category.");
    } else {
      embed.setDescription(itemDescriptions.join("\n"));
    }

    const row = new ActionRowBuilder<ButtonBuilder>();

    const previousButton = new ButtonBuilder()
      .setCustomId(`shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`)
      .setLabel("«")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0);

    const nextButton = new ButtonBuilder()
      .setCustomId(
        `shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`
      )
      .setLabel("»")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex >= totalPages - 1);

    row.addComponents(previousButton, nextButton);

    const menuRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
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

    await interaction.update({
      embeds: [embed],
      components: [menuRow, row],
    });
  },
} as ComponentModule<ButtonInteraction<"cached">>;

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
import { WeaponData, FoodData, Items } from "../../handler/types/Database";
import { Colors } from "../../config";

export = {
  id: "shopCategoryItems",
  type: ComponentTypes.SelectMenu,
  async execute(client, menu, extras) {
    const itemsPerPage = Number(extras[0]);
    const pageIndex = Number(extras[1]);

    const selectedType = menu.values[0] as ItemType;

    let selectedItems: Items[];

    if (selectedType === "weapon") {
      selectedItems = Array.from(client.items.weapon.values()).filter(
        (item) => !item.disabled
      );

      const totalPages = Math.ceil(selectedItems.length / itemsPerPage);
      const currentItems = selectedItems.slice(
        pageIndex * itemsPerPage,
        (pageIndex + 1) * itemsPerPage
      ) as WeaponData[];

      const weaponDescriptions = currentItems.map((item) => {
        let itemDescription = `${item.icon} **${
          item.name
        }** - Price: ${inlineCode(item.price.toString())}`;

        itemDescription += `\n› Damage: ${inlineCode(
          item.damage.toString()
        )} ❘ Durability: ${inlineCode(
          item.durability === "unlimited"
            ? "unlimited"
            : item.durability.toString()
        )} ❘ Type: ${inlineCode(item.weaponType)}`;

        itemDescription += `\n-# ➜ ${item.description}`;

        return itemDescription;
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Normal)
        .setTitle("Weapons")
        .setDescription(weaponDescriptions.join("\n"));

      const row = new ActionRowBuilder<ButtonBuilder>();

      const previousButton = new ButtonBuilder()
        .setCustomId(
          `shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`
        )
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

      await menu.update({
        embeds: [embed],
        components: [menuRow, row],
      });
    } else if (selectedType === "food") {
      selectedItems = Array.from(client.items.food.values()).filter(
        (item) => !item.disabled
      );

      const totalPages = Math.ceil(selectedItems.length / itemsPerPage);
      const currentItems = selectedItems.slice(
        pageIndex * itemsPerPage,
        (pageIndex + 1) * itemsPerPage
      ) as FoodData[];

      const foodDescriptions = currentItems.map((item) => {
        let itemDescription = `${item.icon} **${
          item.name
        }** - Price: ${inlineCode(item.price.toString())}`;

        itemDescription += `\n› Drinkable: ${inlineCode(
          item.drinkable ? "yes" : "no"
        )} ❘ Effects: ${
          item.effects && item.effects.length > 0
            ? item.effects.map((effect) => inlineCode(effect)).join(" ")
            : "None"
        }`;

        itemDescription += `\n-# ➜ ${item.description}`;

        return itemDescription;
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Normal)
        .setTitle("Foods")
        .setDescription(foodDescriptions.join("\n"));

      const row = new ActionRowBuilder<ButtonBuilder>();

      const previousButton = new ButtonBuilder()
        .setCustomId(
          `shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`
        )
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

      await menu.update({
        embeds: [embed],
        components: [menuRow, row],
      });
    } else {
      await menu.update({ embeds: [], components: [] });
    }
  },
} as ComponentModule<StringSelectMenuInteraction<"cached">>;

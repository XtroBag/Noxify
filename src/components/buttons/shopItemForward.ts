import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
} from "discord.js";
import { Colors, Emojis } from "../../config";
import { ComponentTypes, ComponentModule } from "../../handler/types/Component";
import {
  Drink,
  Item,
  ItemType,
  Meal,
  Weapon,
  WeaponType,
} from "../../handler/types/economy/EconomyItem";

export = {
  id: `shopItemForward`,
  type: ComponentTypes.Button,
  async execute(client, interaction, extras) {
    let pageIndex = Number(extras[0]); // Page index coming from the button press
    const itemsPerPage = Number(extras[1]);
    const selectedType = String(extras[2]) as ItemType;

    const economy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

    let embed = new EmbedBuilder().setColor(Colors.Normal);

    pageIndex++;

    switch (selectedType) {
      case "ingredients":
        {
          const selectedItems = client.utils.getItemsByType("ingredients");
          const sortedList = selectedItems.sort((a, b) =>
            a.name.singular.localeCompare(b.name.singular)
          );

          const totalPages = Math.ceil(sortedList.length / itemsPerPage);
          const ingredients = sortedList.slice(
            pageIndex * itemsPerPage,
            (pageIndex + 1) * itemsPerPage
          ) as Item[];

          const longestItemNameLength = Math.max(
            ...ingredients.map((item) => item.name.singular.length)
          );

          const topic = "";
          let description = "";

          if (topic.length > 0) {
            description += `${topic}\n\n`;
          }

          ingredients.forEach((item) => {
            const formattedPrice = client.utils.formatNumber(item.price);
            const paddedName = item.name.singular.padEnd(
              longestItemNameLength,
              " "
            );
            description += `${item.icon} **\`${paddedName}\`** ${inlineCode(
              formattedPrice
            )} ${economy.icon}\n`;
          });

          embed.setDescription(description);
          embed.setFooter({
            text: `Viewing: ${
              selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
            }`,
          });

          const buttonRow =
            totalPages > 1
              ? [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Back)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex === 0),
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Forward)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex >= totalPages - 1)
                  ),
                ]
              : [];

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
                    {
                      label: "Ingredients",
                      value: "ingredients",
                      emoji: Emojis.Ingredients,
                    },
                    { label: "Drinks", value: "drinks", emoji: Emojis.Drinks },
                    { label: "Meals", value: "meals", emoji: Emojis.Meals },
                    {
                      label: "Weapons",
                      value: "weapons",
                      emoji: Emojis.Weapons,
                    },
                  ])
              ),
              ...buttonRow,
            ],
          });
        }
        break;

      case "drinks":
        {
          const selectedItems = client.utils.getItemsByType("drinks");
          const sortedList = selectedItems.sort((a, b) =>
            a.name.singular.localeCompare(b.name.singular)
          );

          const totalPages = Math.ceil(sortedList.length / itemsPerPage);
          const drinks = sortedList.slice(
            pageIndex * itemsPerPage,
            (pageIndex + 1) * itemsPerPage
          ) as Drink[];

          const longestItemNameLength = Math.max(
            ...drinks.map((item) => item.name.singular.length)
          );

          const topic = "";
          let description = "";

          if (topic.length > 0) {
            description += `${topic}\n\n`;
          }

          drinks.forEach((item) => {
            const formattedPrice = client.utils.formatNumber(item.price);
            const paddedName = item.name.singular.padEnd(
              longestItemNameLength,
              " "
            );

            description += `${item.icon} **\`${paddedName}\`** ${inlineCode(
              formattedPrice
            )} ${economy.icon}\n`;

            description += `${Emojis.Blank} ${
              Emojis.Description
            } Description: ${item.description || "Unknown"}\n`;
            description += `${Emojis.Blank} ${
              Emojis.Ingredients
            } Ingredients: ${
              item.ingredientsRequired && item.ingredientsRequired.length > 0
                ? item.ingredientsRequired
                    .map((ingredient) =>
                      inlineCode(
                        `${ingredient.name}${
                          ingredient.amountNeeded > 1
                            ? ` x${ingredient.amountNeeded}`
                            : ""
                        }`
                      )
                    )
                    .join(" | ")
                : inlineCode("None")
            }\n`;
          });

          embed.setDescription(description);
          embed.setFooter({
            text: `Viewing: ${
              selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
            }`,
          });

          const buttonRow =
            totalPages > 1
              ? [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Back)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex === 0),
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Forward)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex >= totalPages - 1)
                  ),
                ]
              : [];

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
                    {
                      label: "Ingredients",
                      value: "ingredients",
                      emoji: Emojis.Ingredients,
                    },
                    { label: "Drinks", value: "drinks", emoji: Emojis.Drinks },
                    { label: "Meals", value: "meals", emoji: Emojis.Meals },
                    {
                      label: "Weapons",
                      value: "weapons",
                      emoji: Emojis.Weapons,
                    },
                  ])
              ),
              ...buttonRow,
            ],
          });
        }
        break;
      case "meals":
        {
          const selectedItems = client.utils.getItemsByType("meals");
          const sortedList = selectedItems.sort((a, b) =>
            a.name.singular.localeCompare(b.name.singular)
          );

          const totalPages = Math.ceil(sortedList.length / itemsPerPage);
          const meals = sortedList.slice(
            pageIndex * itemsPerPage,
            (pageIndex + 1) * itemsPerPage
          ) as Meal[];

          const longestItemNameLength = Math.max(
            ...meals.map((item) => item.name.singular.length)
          );

          const topic = "";
          let description = "";

          if (topic.length > 0) {
            description += `${topic}\n\n`;
          }

          meals.forEach((item) => {
            const formattedPrice = client.utils.formatNumber(item.price);
            const paddedName = item.name.singular.padEnd(
              longestItemNameLength,
              " "
            );

            description += `${item.icon} **\`${paddedName}\`** ${inlineCode(
              formattedPrice
            )} ${economy.icon}\n`;

            description += `${Emojis.Blank} ${
              Emojis.Description
            } Description: ${item.description || "Unknown"}\n`;

            description += `${Emojis.Blank} ${
              Emojis.Ingredients
            } Ingredients: ${
              item.ingredientsRequired && item.ingredientsRequired.length > 0
                ? item.ingredientsRequired
                    .map((ingredient) =>
                      inlineCode(
                        `${ingredient.name}${
                          ingredient.amountNeeded > 1
                            ? ` x${ingredient.amountNeeded}`
                            : ""
                        }`
                      )
                    )
                    .join(" | ")
                : inlineCode("None")
            }\n`;
          });

          embed.setDescription(description);
          embed.setFooter({
            text: `Viewing: ${
              selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
            }`,
          });

          const buttonRow =
            totalPages > 1
              ? [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Back)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex === 0),
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Forward)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex >= totalPages - 1)
                  ),
                ]
              : [];

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
                    {
                      label: "Ingredients",
                      value: "ingredients",
                      emoji: Emojis.Ingredients,
                    },
                    { label: "Drinks", value: "drinks", emoji: Emojis.Drinks },
                    { label: "Meals", value: "meals", emoji: Emojis.Meals },
                    {
                      label: "Weapons",
                      value: "weapons",
                      emoji: Emojis.Weapons,
                    },
                  ])
              ),
              ...buttonRow,
            ],
          });
        }
        break;

      case "weapons":
        {
          const selectedItems = client.utils.getItemsByType("weapons");
          const sortedList = selectedItems.sort((a, b) =>
            a.name.singular.localeCompare(b.name.singular)
          );

          const totalPages = Math.ceil(sortedList.length / itemsPerPage);
          const weapons = sortedList.slice(
            pageIndex * itemsPerPage,
            (pageIndex + 1) * itemsPerPage
          ) as Weapon[];

          const longestItemNameLength = Math.max(
            ...weapons.map((item) => item.name.singular.length)
          );

          const longestWeaponTypeNameLength = Math.max(
            ...weapons.map((item) =>
              item.weaponType ? item.weaponType.length : 0
            )
          );

          const longestDamageLength = Math.max(
            ...weapons.map((item) =>
              item.damage ? item.damage.toString().length : 0
            )
          );

          const typeIcons: { [key in WeaponType]: string } = {
            Ammo: Emojis.Ammo,
            Melee: Emojis.Melee,
            Ranged: Emojis.Ranged,
            Throwable: Emojis.Throwable,
            Other: Emojis.Other,
          };

          const topic = "";
          let description = "";

          if (topic.length > 0) {
            description += `${topic}\n\n`;
          }

          weapons.forEach((item) => {
            const formattedPrice = client.utils.formatNumber(item.price);
            const paddedName = item.name.singular.padEnd(
              longestItemNameLength,
              " "
            );

            const paddedWeaponType = (item.weaponType || "Unknown").padEnd(
              longestWeaponTypeNameLength,
              " "
            );

            const paddedDamage = (
              item.damage ? item.damage.toString() : "Unknown"
            ).padEnd(longestDamageLength, " ");

            const itemIcon = typeIcons[item.weaponType || "Unknown"];

            description += `${item.icon} **\`${paddedName}\`** ${inlineCode(
              formattedPrice
            )} ${economy.icon}\n`;

            description += `${Emojis.Blank} ${
              Emojis.Description
            } Description: ${item.description || "Unknown"}\n`;

            description += `${Emojis.Blank} ${itemIcon} Type: ${inlineCode(
              paddedWeaponType
            )} ${Emojis.Damage} Damage: ${inlineCode(paddedDamage)} ${
              Emojis.Uses
            } Uses: ${inlineCode(item.uses.toString() || "Unknown")}\n`;
          });

          embed.setDescription(description);
          embed.setFooter({
            text: `Viewing: ${
              selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
            }`,
          });

          const buttonRow =
            totalPages > 1
              ? [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemBack|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Back)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex === 0),
                    new ButtonBuilder()
                      .setCustomId(
                        `shopItemForward|${pageIndex}|${itemsPerPage}|${selectedType}`
                      )
                      .setEmoji(Emojis.Forward)
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(pageIndex >= totalPages - 1)
                  ),
                ]
              : [];

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
                    {
                      label: "Ingredients",
                      value: "ingredients",
                      emoji: Emojis.Ingredients,
                    },
                    { label: "Drinks", value: "drinks", emoji: Emojis.Drinks },
                    { label: "Meals", value: "meals", emoji: Emojis.Meals },
                    {
                      label: "Weapons",
                      value: "weapons",
                      emoji: Emojis.Weapons,
                    },
                  ])
              ),
              ...buttonRow,
            ],
          });
        }
        break;

      default:
        break;
    }
  },
} as ComponentModule<ButtonInteraction<"cached">>;

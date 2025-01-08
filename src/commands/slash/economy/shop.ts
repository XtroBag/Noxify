import {
  getEconomy,
  updateUserPermissions,
} from "../../../handler/util/DatabaseCalls";
import { Colors } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import {
  Items,
  FoodData,
  WeaponData,
  UserEconomy,
} from "../../../handler/types/Database";
import { Economy } from "../../../handler/schemas/models/Models";
import { format } from "date-fns";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Where to buy items")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand((option) =>
      option.setName("view").setDescription("View the shop")
    )
    .addSubcommand((option) =>
      option
        .setName("buy")
        .setDescription("Buy an item from the shop")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The item to buy")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  async execute({ client, interaction }) {
    const economy = await getEconomy({ guildID: interaction.guildId });
    const subcommand = interaction.options.getSubcommand();

    if (economy) {
      const embed = new EmbedBuilder().setColor(Colors.Normal);

      if (subcommand === "view") {
        embed
          .setTitle("Economy Shop")
          .setDescription(
            "Browse the items available for purchase in the economy shop."
          );

        const itemsPerPage = 10;

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

        await interaction.reply({
          embeds: [embed],
          components: [menuRow],
        });
      } else if (subcommand === "buy") {
        const buyingItem = interaction.options.getString("item");

        // If I add new item categories, I need to add the client to find it here
        let item: Items =
          client.items.food.find((food) => food.name === buyingItem) ||
          client.items.weapon.find((weapon) => weapon.name === buyingItem);

        if (!item) {
          return await interaction.reply({
            content: `Item "${buyingItem}" not found in the shop.`,
          });
        }

        const user = economy.users.find(
          (user) => user.userID === interaction.member.id
        );

        if (!user) {
          return await interaction.reply({
            content: "User not found in the economy system.",
          });
        }

        if (user.accountBalance < item.price) {
          return await interaction.reply({
            content: `You don't have enough funds to buy **${buyingItem}**, Check your account balance.`,
          });
        }

        const maxAmount =
          item.amountPerUser === "unlimited" ? Infinity : item.amountPerUser;
        const currentAmount = user.inventory.items[`${item.type}s`].filter(
          (existingItem) => existingItem.name === item.name
        ).length;

        if (currentAmount >= maxAmount) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Warning)
                .setDescription(
                  `You've reached the maximum limit of ${inlineCode(
                    maxAmount.toString()
                  )} ${item.name}'s`
                ),
            ],
          });
        }

        const itemExistsInInventory: Items = user.inventory.items[
          item.type + "s"
        ].some((existingItem) => existingItem.name === item.name);

        if (itemExistsInInventory) {
          if (user.privacySettings.purchaseWarnings) {
            const confirmButton = new ButtonBuilder()
              .setCustomId("confirm-purchase")
              .setLabel("Confirm")
              .setStyle(ButtonStyle.Success);

            const disableButton = new ButtonBuilder()
              .setCustomId("disable-warning-perm")
              .setLabel("Disable Warning")
              .setStyle(ButtonStyle.Danger);

            const actionRow =
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirmButton,
                disableButton
              );

            const reply = await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(Colors.Warning)
                  .setDescription(
                    `You already own a **${item.name}**. Are you sure you wanna buy another one?`
                  ),
              ],
              components: [actionRow],
            });

            // Collect button interaction
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = reply.createMessageComponentCollector({
              filter,
              time: 120000,
            });

            const embed = new EmbedBuilder()
              .setColor(Colors.Success)
              .setDescription(
                `Successfully purchased **${item.name}** and added it to your inventory.`
              );

            collector.on("collect", async (buttonInteraction) => {
              if (buttonInteraction.customId === "confirm-purchase") {
                await completePurchase(user, item, interaction);
                return await buttonInteraction.update({
                  embeds: [embed],
                  components: [],
                });
              } else if (
                buttonInteraction.customId === "disable-warning-perm"
              ) {
                await updateUserPermissions({
                  guildID: interaction.guildId,
                  userID: user.userID,
                  selectedPermissions: ["purchaseWarnings"],
                });
                return await buttonInteraction.deferUpdate();
              }
            });

            collector.on("end", async () => {
              return await interaction.deleteReply().catch(() => {});
            });

            return;
          }
        }

        await completePurchase(user, item, interaction);
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Success)
              .setDescription(`Successfully purchased **${item.name}**.`),
          ],
        });
      }
    }
  },

  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const allItems = [
      ...Array.from(client.items.weapon.values()),
      ...Array.from(client.items.food.values()),
    ];

    const filteredItems = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(focusedValue.toLowerCase()) &&
        !item.disabled
    );

    if (filteredItems.length > 25) {
      await interaction.respond([
        {
          name: "Too many items to list. Please type the name of the item you're looking for.",
          value: "",
        },
      ]);
    } else {
      const suggestions = filteredItems.map((item) => ({
        name: item.name,
        value: item.name,
      }));

      await interaction.respond(suggestions);
    }
  },
} as SlashCommandModule;

async function completePurchase(
  user: UserEconomy,
  item: Items,
  interaction: ChatInputCommandInteraction<"cached">
) {
  if (item.type === "food") {
    const foodItem = item as FoodData;
    await Economy.updateOne(
      { guildID: interaction.guildId, "users.userID": user.userID },
      {
        $push: {
          [`users.$.inventory.items.${item.type}s`]: {
            name: foodItem.name,
            description: foodItem.description,
            type: foodItem.type,
            icon: foodItem.icon,
            price: foodItem.price,
            effects: foodItem.effects,
            disabled: foodItem.disabled,
            drinkable: foodItem.drinkable,
            amountPerUser: foodItem.amountPerUser,
            uses: 0, // custom set
          },
        },
        $inc: {
          "users.$.accountBalance": -foodItem.price,
        },
      }
    );
  } else if (item.type === "weapon") {
    const weaponItem = item as WeaponData;
    await Economy.updateOne(
      { guildID: interaction.guildId, "users.userID": user.userID },
      {
        $push: {
          [`users.$.inventory.items.${item.type}s`]: {
            name: weaponItem.name,
            description: weaponItem.description,
            type: weaponItem.type,
            icon: weaponItem.icon,
            price: weaponItem.price,
            damage: weaponItem.damage,
            level: 0, // custom set
            uses: 0, // custom set
            amountPerUser: weaponItem.amountPerUser,
            weaponType: weaponItem.weaponType,
            durability: weaponItem.durability,
            disabled: weaponItem.disabled,
            purchasedAt: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"), // custom set
          },
        },
        $inc: {
          "users.$.accountBalance": -weaponItem.price,
        },
      }
    );
  }
}

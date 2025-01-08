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

        if (client.items.weapon.size > 0) {
          const weaponItems = Array.from(client.items.weapon.values())
            .filter((item) => !item.disabled)
            .map((item) => {
              return `${item.icon} **${item.name}** - Price: ${inlineCode(
                item.price.toString()
              )}\n-# ➜ ${item.description}`;
            });

          if (weaponItems.length > 0) {
            embed.addFields({
              name: "Weapons",
              value: weaponItems.join("\n"),
            });
          } else {
            embed.addFields({
              name: "Weapons",
              value: "No available items.",
            });
          }
        }

        if (client.items.food.size > 0) {
          const foodItems = Array.from(client.items.food.values())
            .filter((item) => !item.disabled)
            .map((item) => {
              return `${item.icon} **${item.name}** - Price: ${inlineCode(
                item.price.toString()
              )}\n-# ➜ ${item.description}`;
            });

          if (foodItems.length > 0) {
            embed.addFields({
              name: "Foods",
              value: foodItems.join("\n"),
            });
          } else {
            embed.addFields({
              name: "Foods",
              value: "No available items.",
            });
          }
        }

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === "buy") {
        const buyingItem = interaction.options.getString("item");

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
              content: `Warning: You already own **${item.name}**. Are you sure you want to buy another one?`,
              components: [actionRow],
            });

            // Collect button interaction
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = reply.createMessageComponentCollector({
              filter,
              time: 120000,
            });

            collector.on("collect", async (buttonInteraction) => {
              if (buttonInteraction.customId === "confirm-purchase") {
                await completePurchase(user, item, interaction);
                return await buttonInteraction.update({
                  content: `You have successfully purchased **${item.name}** and added it to your inventory.`,
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

            collector.on("end", () => {
              interaction.editReply({ components: [] });
            });

            return;
          }
        }

        await completePurchase(user, item, interaction);
        return await interaction.reply({
          content: `You have successfully purchased **${item.name}** and added it to your inventory.`,
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

import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

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
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of this item you would like to buy")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
    ),
  async execute({ client, interaction }) {
    const subcommand = interaction.options.getSubcommand();

    const economy = await client.utils.getEconomy({
      guildID: interaction.guildId,
    });

    if (!economy)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} This server doesn't have an economy setup yet.`
            ),
        ],
      });

    if (economy) {
      const embed = new EmbedBuilder().setColor(Colors.Normal);

      if (subcommand === "view") {
        embed
          .setTitle("Economy Shop")
          .setDescription(
            "Browse the items available for purchase in the economy shop."
          );

        const itemsPerPage = 12;

        const menuRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`shopCategoryItems|<ItemsPerPage:${itemsPerPage}>|<PageIndex:${0}>`)
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
                { label: "Weapons", value: "weapons", emoji: Emojis.Weapons },
                { label: "Ammos", value: "ammos", emoji: Emojis.Ammo },
              ])
          );

        await interaction.reply({
          embeds: [embed],
          components: [menuRow],
        });
      } else if (subcommand === "buy") {
        let buyingItem = interaction.options.getString("item");
        const amount = interaction.options.getNumber("amount");

        const mentionPattern = /<@!?(\d+)>/;
        const urlPattern = /https?:\/\/[^\s]+/;

        if (buyingItem.includes("@everyone") || buyingItem.includes("@here")) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} You cannot mention ${inlineCode(
                    "@everyone"
                  )} or ${inlineCode("@here")} as an item`
                ),
            ],
          });
        } else if (urlPattern.test(buyingItem)) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} You cannot search a link as an item`
                ),
            ],
          });
        } else if (mentionPattern.test(buyingItem)) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} You cannot mention users as an item`
                ),
            ],
          });
        }

        const capitalizeWords = (str: string): string => {
          return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
        };

        buyingItem = capitalizeWords(buyingItem);

        const allItems = client.utils.getAll();
        const itemType = allItems.find(
          (item) => item.name.singular === buyingItem
        );

        if (!itemType) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} **${buyingItem}** not found in the shop.`
                ),
            ],
          });
        }

        const item = allItems.find(
          (item) =>
            item.shopType === itemType.shopType &&
            item.name.singular === buyingItem
        );

        const user = economy.users.find(
          (user) => user.userID === interaction.member.id
        );

        if (!user) {
          await client.utils.addUserToEconomy({
            guildID: interaction.guildId,
            userID: interaction.member.id,
            displayName: interaction.member.displayName,
            joined: new Date(),
            health: 100,
            bankingAccounts: {
              bank: economy.defaultBalance,
              wallet: 0,
            },
            privacyOptions: {
              receiveNotifications: true,
              viewInventory: false,
            },
            milestones: [],
            transactions: [],
            inventory: {
              meals: [],
              weapons: [],
              drinks: [],
              ingredients: [],
              ammos: [],
            },
            effects: [],
          });
        }

        const updatedEconomy = await client.utils.getEconomy({
          guildID: interaction.guildId,
        });

        const newUser = updatedEconomy.users.find(
          (user) => user.userID === interaction.member.id
        );

        const maxAmount =
          item.amountPerUser === "Infinite" ? Infinity : item.amountPerUser;

        const inventoryItems = client.utils.getInventoryItems(
          newUser,
          item.shopType
        );

        const itemName =
          maxAmount === 1 ? item.name.singular : item.name.plural;

        const currentAmount = inventoryItems.filter(
          (item) => item.name.singular === itemName
        ).length;

        if (currentAmount + amount > maxAmount) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} You can't buy more than ${inlineCode(
                    maxAmount.toString()
                  )} ${itemName}.`
                ),
            ],
          });
        }

        const noFunds = amount === 1 ? item.name.singular : item.name.plural;

        if (newUser.bankingAccounts.wallet < item.price * amount) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} You don't have enough funds to buy ${amount} **${noFunds}**. Check your account balance.`
                ),
            ],
          });
        }

        await client.utils.completePurchase({
          user: newUser,
          item: item,
          amount: amount,
          guildID: interaction.guildId,
        });

        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Success)
              .setDescription(
                `${Emojis.Check} You have successfully purchased ${inlineCode(
                  amount.toString()
                )} ${
                  amount > 1 ? item.name.plural : item.name.singular
                } and added it to your inventory.`
              ),
          ],
        });
      }
    }
  },

  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();

    const items = client.utils.getAll();

    const filteredItems = items.filter(
      (item) =>
        item.name.singular.toLowerCase().includes(focusedValue.toLowerCase()) &&
        !item.disabled
    );

    if (filteredItems.length > 25) {
      await interaction.respond([
        {
          name: "Please enter the item you're trying to purchase.",
          value: "",
        },
      ]);
    } else {
      const suggestions = filteredItems.map((item) => ({
        name: item.name.singular,
        value: item.name.singular,
      }));

      await interaction.respond(suggestions);
    }
  },
} as SlashCommandModule;

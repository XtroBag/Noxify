import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
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
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of this item you would like to buy")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true)
        )
    ),
  async execute({ client, interaction }) {
    const subcommand = interaction.options.getSubcommand();

    const economy = await client.utils.calls.getEconomy({ guildID: interaction.guildId });

    if (!economy)
      return await interaction.reply({
        embeds: [new EmbedBuilder().setColor(Colors.Error).setDescription(`${Emojis.Cross} This server doesn't have an economy setup yet.`)],
      });

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
                { label: 'Ingredients', value: 'ingredient' },
                { label: 'Drinks', value: 'drink'},
                { label: 'Meals', value: 'meal'},
                { label: 'Weapons', value: 'weapon' },
              ])
          );

        await interaction.reply({
          embeds: [embed],
          components: [menuRow],
        });
      } else if (subcommand === "buy") {
        const buyingItem = interaction.options.getString("item");
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

        const allItems = client.utils.items.getAllItems();
        const itemType = allItems.find(
          (item) => item.name.singular === buyingItem
        );

        const item = allItems.find((item) => item.type === itemType.type && item.name.singular === buyingItem);

        if (!item) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(
                  `${Emojis.Cross} Item **${buyingItem}** not found in the shop.`
                ),
            ],
          });
        }

        const user = economy.users.find(
          (user) => user.userID === interaction.member.id
        );

        if (!user) {
          await client.utils.calls.addEconomyUser({
            guildID: interaction.guildId,
            userID: interaction.member.id,
            displayName: interaction.member.displayName,
            joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
            accountBalance: economy.defaultBalance,
            bankBalance: 0,
            privacySettings: {
              receiveNotifications: true,
              viewInventory: false,
            },
            milestones: [],
            transactions: [],
            inventory: {
              items: { meal: [], weapon: [], drink: [], ingredient: [] },
            },
            activeEffects: [],
          });
        }
        const updatedEcononmy = await client.utils.calls.getEconomy({
          guildID: interaction.guildId,
        });

        const newUser = updatedEcononmy.users.find(
          (user) => user.userID === interaction.member.id
        );

        const maxAmount =
          item.amountPerUser === "unlimited" ? Infinity : item.amountPerUser;

        const currentAmount = client.utils.items.getInventoryItemAmount(
          newUser,
          item.type,
          item.name.singular
        );

        const itemName =
          maxAmount === 1 ? item.name.singular : item.name.plural;

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

        if (newUser.accountBalance < item.price * amount) {
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

        await client.utils.calls.completePurchase(newUser, item, amount, interaction);
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

    const items = client.utils.items.getAllItems();

    const filteredItems = items.filter(
      (item) =>
        item.name.singular.toLowerCase().includes(focusedValue.toLowerCase()) &&
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
        name: item.name.singular,
        value: item.name.singular,
      }));

      await interaction.respond(suggestions);
    }
  },
} as SlashCommandModule;

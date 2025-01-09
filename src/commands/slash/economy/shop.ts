import {
  getEconomy,
  completePurchase,
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
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import {
  findItemByName,
  getAllItems,
  getInventoryItemAmount,
} from "../../../handler/util/Items";

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

    const economy = await getEconomy({ guildID: interaction.guildId });

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
        const amount = interaction.options.getNumber("amount");

        const mentionPattern = /<@!?(\d+)>/;
        const urlPattern = /https?:\/\/[^\s]+/;

        if (buyingItem.includes("@everyone") || buyingItem.includes("@here")) {
          return await interaction.reply({
            content: "You cannot mention `@everyone` or `@here` as an item",
          });
        } else if (urlPattern.test(buyingItem)) {
          return await interaction.reply({
            content: "You cannot search a link as an item",
          });
        } else if (mentionPattern.test(buyingItem)) {
          return await interaction.reply({
            content: "You cannot mention users as an item",
          });
        }

        const item = findItemByName(client, buyingItem);

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

        if (user.accountBalance < item.price * amount) {
          return await interaction.reply({
            content: `You don't have enough funds to buy **${amount} ${buyingItem}**. Check your account balance.`,
          });
        }

        const maxAmount =
          item.amountPerUser === "unlimited" ? Infinity : item.amountPerUser;

        const currentAmount = getInventoryItemAmount(
          user,
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
                  `You can't buy more than ${inlineCode(
                    maxAmount.toString()
                  )} ${itemName}.`
                ),
            ],
          });
        }

        await completePurchase(user, item, amount, interaction);
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Success)
              .setDescription(
                `You have successfully purchased ${inlineCode(
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

    const items = getAllItems(client);

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

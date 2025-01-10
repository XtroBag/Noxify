import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler";
import {
  ApplicationIntegrationType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import {
  addEconomyUser,
  getEconomy,
  useFoodItem,
} from "../../../handler/util/DatabaseCalls";
import { format } from "date-fns";
import { getInventoryItems, getItemsByType } from "../../../handler/util/Items";
import { Colors } from "../../../config";
import { FoodData } from "src/handler/types/Database";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("food")
    .setDescription(
      "Use food items from your inventory to restore health or gain buffs."
    )
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eat")
        .setDescription("Eat a food item to restore health or energy.")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The food item you want to eat.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("drink")
        .setDescription("Drink a beverage to restore hydration or gain buffs.")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The drink item you want to consume.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async execute({ client, interaction }) {
    const economy = await getEconomy({ guildID: interaction.guildId });

    const subcommand = interaction.options.getSubcommand();
    const pickedItem = interaction.options.getString("item");

    if (!economy) {
      await interaction.reply({
        content: "This server does not have an Economy system set up yet.",
        ephemeral: true,
      });
      return;
    }

    const user = economy.users.find(
      (user) => user.userID === interaction.member.id
    );

    if (!user) {
      await addEconomyUser({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        displayName: interaction.member.displayName,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        accountBalance: economy.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: { items: { food: [], weapon: [] } },
        activeEffects: [],
      });
    }

    const updatedEconomy = await getEconomy({
      guildID: interaction.guildId,
    });

    const newUser = updatedEconomy.users.find(
      (user) => user.userID === interaction.member.id
    );

    if (subcommand === "eat") {
      const userItems = getInventoryItems(newUser, "food");
      const validItems = getItemsByType(client, "food");

      const isValid = validItems.some(
        (item) => item.name.singular === pickedItem
      );

      if (!isValid) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription(`**${pickedItem}** is not a valid item`),
          ],
        });
      }

      const hasItem = userItems.some(
        (item) => item.name.singular === pickedItem && item.type === "food"
      );

      if (!hasItem) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription(`You don't own a **${pickedItem}**`),
          ],
        });
      }

      const item = userItems.find(
        (item) => item.name.singular === pickedItem && item.type === "food"
      ) as FoodData;

      const effects = item.effects;

      if (item && item.drinkable) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription(
                `**${pickedItem}** is a drink, not a food item. Please use the /food drink command to drink it.`
              ),
          ],
        });
      }

      let effectDescriptions = [];

      if (effects && effects.length > 0) {
        const effectNames = effects.map((effect) => effect.name);
        effectDescriptions.push(`-# effects: ${effectNames.join(", ")}`);
      } else {
        effectDescriptions.push("");
      }

      const effectsMessage = effectDescriptions.join("\n");

      const messages = [
        `You devoured the **${pickedItem}**! Absolutely delicious!\n${effectsMessage}`,
        `You munched on the **${pickedItem}**! That was tasty!\n${effectsMessage}`,
        `Mmm, you just ate the **${pickedItem}**! So satisfying!\n${effectsMessage}`,
        `You just gobbled down that **${pickedItem}**! Yum!\n${effectsMessage}`,
        `That was a tasty bite of **${pickedItem}**! You enjoyed it!\n${effectsMessage}`,
        `You snacked on the **${pickedItem}**! What a treat!\n${effectsMessage}`,
        `The **${pickedItem}** is all gone! That hit the spot!\n${effectsMessage}`,
        `You ate the **${pickedItem}** like a pro! That was delicious!\n${effectsMessage}`,
        `You chomped down on the **${pickedItem}**! So good!\n${effectsMessage}`,
        `You savored the **${pickedItem}**! That was a tasty choice!\n${effectsMessage}`,
        `A tasty feast of **${pickedItem}** is now in your belly!\n${effectsMessage}`,
        `The **${pickedItem}** didn’t stand a chance! That was delicious!\n${effectsMessage}`,
        `You just polished off the **${pickedItem}**! So yum!\n${effectsMessage}`,
        `You made quick work of the **${pickedItem}**! What a flavor!\n${effectsMessage}`,
        `You scarfed down the **${pickedItem}**! Now that was tasty!\n${effectsMessage}`,
        `You savored every bite of the **${pickedItem}**! Delicious!\n${effectsMessage}`,
        `The **${pickedItem}** is gone, and you loved every bite!\n${effectsMessage}`,
        `You polished off the **${pickedItem}**! Now you’re good to go!\n${effectsMessage}`,
        `Yum! The **${pickedItem}** was a perfect choice!\n${effectsMessage}`,
        `You just enjoyed the **${pickedItem}** to the fullest!\n${effectsMessage}`,
      ];

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      //----------------------------------------------------------------------------------------------------------------------
      // Remove the item from the inventory after consumption
      const updatedItems = newUser.inventory.items.food.filter(
        (item) => item.name.singular !== pickedItem
      );

      await useFoodItem(
        interaction.guildId,
        interaction.member.id,
        pickedItem,
        effects
      );

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Success)
            .setDescription(randomMessage),
        ],
      });
    } else if (subcommand === "drink") {
      // Handle the "drink" subcommand here, similar to "eat"
    }
  },

  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();

    const items = getItemsByType(client, "food");

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

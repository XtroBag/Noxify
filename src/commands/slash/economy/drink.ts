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
  import { format } from "date-fns";
  import { Colors, Emojis } from "../../../config";
  import { DrinkData } from "../../../handler/types/Database";

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Global,
    data: new SlashCommandBuilder()
      .setName("drink")
      .setDescription(
        "drink a cool drink"
      )
      .setContexts([InteractionContextType.Guild])
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
          .addStringOption((option) =>
            option
              .setName("item")
              .setDescription("The food item you want to eat.")
              .setRequired(true)
              .setAutocomplete(true)
          
      ),
  
    async execute({ client, interaction }) {
      const economy = await client.utils.calls.getEconomy({ guildID: interaction.guildId });
  
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
        await client.utils.calls.addEconomyUser({
          guildID: interaction.guildId,
          userID: interaction.member.id,
          displayName: interaction.member.displayName,
          joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
          accountBalance: economy.defaultBalance,
          bankBalance: 0,
          privacySettings: { receiveNotifications: true, viewInventory: false },
          milestones: [],
          transactions: [],
          inventory: { items: { meal: [], weapon: [], drink: [], ingredient: [] } },
          activeEffects: [],
        });
      }
  
      const updatedEconomy = await client.utils.calls.getEconomy({
        guildID: interaction.guildId,
      });
  
      const newUser = updatedEconomy.users.find(
        (user) => user.userID === interaction.member.id
      );
  
        const userItems = client.utils.items.getInventoryItems(newUser, "drink");
        const validItems = client.utils.items.getItemsByType("drink");
  
        const isValid = validItems.some(
          (item) => item.name.singular === pickedItem
        );
  
        if (!isValid) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(`${Emojis.Cross} **${pickedItem}** is not a valid item`),
            ],
          });
        }
  
        const hasItem = userItems.some(
          (item) => item.name.singular === pickedItem && item.type === "drink"
        );
  
        if (!hasItem) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(`${Emojis.Cross} You don't own a **${pickedItem}**`),
            ],
          });
        }
  
        const item = userItems.find(
          (item) => item.name.singular === pickedItem && item.type === "drink"
        ) as DrinkData;
  
        const effects = item.effects;
  
        let effectDescriptions = [];
  
        if (effects && effects.length > 0) {
          const effectNames = effects.map((effect) => effect.name);
          effectDescriptions.push(`-# effects: ${effectNames.join(", ")}`);
        } else {
          effectDescriptions.push("");
        }
  
        const effectsMessage = effectDescriptions.join("\n");
  
        const messages = [
          `${Emojis.Check} You devoured the **${pickedItem}**! Absolutely delicious!\n${effectsMessage}`,
          `${Emojis.Check} You munched on the **${pickedItem}**! That was tasty!\n${effectsMessage}`,
          `${Emojis.Check} Mmm, you just ate the **${pickedItem}**! So satisfying!\n${effectsMessage}`,
          `${Emojis.Check} You just gobbled down that **${pickedItem}**! Yum!\n${effectsMessage}`,
          `${Emojis.Check} That was a tasty bite of **${pickedItem}**! You enjoyed it!\n${effectsMessage}`,
          `${Emojis.Check} You snacked on the **${pickedItem}**! What a treat!\n${effectsMessage}`,
          `${Emojis.Check} The **${pickedItem}** is all gone! That hit the spot!\n${effectsMessage}`,
          `${Emojis.Check} You ate the **${pickedItem}** like a pro! That was delicious!\n${effectsMessage}`,
          `${Emojis.Check} You chomped down on the **${pickedItem}**! So good!\n${effectsMessage}`,
          `${Emojis.Check} You savored the **${pickedItem}**! That was a tasty choice!\n${effectsMessage}`,
          `${Emojis.Check} A tasty feast of **${pickedItem}** is now in your belly!\n${effectsMessage}`,
          `${Emojis.Check} The **${pickedItem}** didn’t stand a chance! That was delicious!\n${effectsMessage}`,
          `${Emojis.Check} You just polished off the **${pickedItem}**! So yum!\n${effectsMessage}`,
          `${Emojis.Check} You made quick work of the **${pickedItem}**! What a flavor!\n${effectsMessage}`,
          `${Emojis.Check} You scarfed down the **${pickedItem}**! Now that was tasty!\n${effectsMessage}`,
          `${Emojis.Check} You savored every bite of the **${pickedItem}**! Delicious!\n${effectsMessage}`,
          `${Emojis.Check} The **${pickedItem}** is gone, and you loved every bite!\n${effectsMessage}`,
          `${Emojis.Check} Yum! The **${pickedItem}** was a perfect choice!\n${effectsMessage}`,
          `${Emojis.Check} You just enjoyed the **${pickedItem}** to the fullest!\n${effectsMessage}`,
        ];
  
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
  
        await client.utils.calls.useFoodItem(
          interaction.guildId,
          interaction.member.id,
          pickedItem,
          effects,
          item.type
        );
  
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Success)
              .setDescription(randomMessage),
          ],
        });
        
    },
  
    async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused();

      const economy = await client.utils.calls.getEconomy({ guildID: interaction.guildId })
      const user = economy.users.find((user) => user.userID === interaction.user.id);
  
      const items = client.utils.items.getInventoryItems(user, 'drink');
  
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
  
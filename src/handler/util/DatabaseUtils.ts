import Logger from "./Logger";
import { Economy } from "../schemas/models/Models";
import {
  AddTransactionParams,
  AddUserParams,
  DatabaseOptions,
  EconomySearchParams,
  UpdateBalanceParams,
  UpdateBalancesAndTransactions,
  UserTransactionsParams,
  GuildEconomy,
  Transaction,
  UpdateUserBankBalance,
  UpdateUserAccountBalance,
  UpdateUserPrivacyPermissions,
  UpdateUserMilestones,
  UserEconomy,
  Items,
  WeaponData,
  IngredientData,
  MealData,
  DrinkData,
} from "../types/Database";
import { format, parse } from "date-fns";
import { ChatInputCommandInteraction } from "discord.js";
import { Mongoose, UpdateResult } from "mongoose";
import { Effect, ItemType } from "../types/Item";
import { DiscordClient } from "./DiscordClient";

export class DatabaseExtras {
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  async connectDatabase(options: DatabaseOptions): Promise<Mongoose | void> {
    try {
      if (options.enabled) {
        Logger.log("MongoDB connected successfully!");
        return await this.client.db.connect(process.env.MONGOOSE_URI, {
          dbName: "Noxify",
          autoCreate: true,
        });
      } else {
        Logger.log("MongoDB disconnected!");
        return await this.client.db.disconnect();
      }
    } catch (error) {
      Logger.error("Failed to connect/disconnect database", error);
      throw error;
    }
  }

  formatAmount(amount: number): string {
    if (isNaN(amount)) return "Invalid number";
    return amount.toLocaleString();
  }

  generateRandomCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }

  convertTimeToDiscordTimestamp(timeString: string): string {
    try {
      const timeFormat = "EEEE, MMMM d, yyyy 'at' h:mm a";
      const parsedDate = parse(timeString, timeFormat, new Date());
      const discordTimestamp = Math.floor(parsedDate.getTime() / 1000);
      return `<t:${discordTimestamp}:R>`;
    } catch (error) {
      Logger.error("Error parsing time string", error);
      throw error;
    }
  }

  isServerEmojiValid(
    emoji: string,
    interaction: ChatInputCommandInteraction<"cached">
  ): boolean {
    try {
      const customEmojiRegex = /<a?:([a-zA-Z0-9_]+):([0-9]+)>/;
      const match = emoji.match(customEmojiRegex);

      if (match) {
        const emojiId = match[2];
        const serverEmojis = interaction.guild.emojis.cache;
        return serverEmojis.has(emojiId);
      }

      const defaultEmojiRegex = /:([a-zA-Z0-9_]+):/;
      const defaultMatch = emoji.match(defaultEmojiRegex);

      if (defaultMatch) {
        return true;
      }

      const unicodeEmojiRegex =
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/u;
      return unicodeEmojiRegex.test(emoji);
    } catch (error) {
      Logger.error("Error validating emoji", error);
      throw error;
    }
  }
}

export class DatabaseCalls {
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  async createEconomy(options: GuildEconomy): Promise<GuildEconomy> {
    return new Economy({
      name: options.name,
      guildID: options.guildID,
      icon: options.icon,
      defaultBalance: options.defaultBalance,
      users: options.users || [],
    }).save();
  }

  async getEconomy(options: EconomySearchParams): Promise<GuildEconomy> {
    return await Economy.findOne({ guildID: options.guildID });
  }

  async addEconomyUser(options: AddUserParams): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: options.guildID },
      {
        $push: {
          users: {
            displayName: options.displayName,
            userID: options.userID,
            joined: options.joined,
            accountBalance: options.accountBalance,
            bankBalance: options.bankBalance,
            privacySettings: options.privacySettings,
            milestones: [],
            transactions: [],
          },
        },
      }
    );
  }

  async addTransaction(options: AddTransactionParams): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: options.guildID, "users.userID": options.userID },
      { $push: { "users.$.transactions": options.transaction } }
    );
  }

  async updateBalances(options: UpdateBalanceParams): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: options.guildID, "users.userID": options.userID },
      {
        $set: {
          "users.$.accountBalance": options.accountBalance,
          "users.$.bankBalance": options.bankBalance,
        },
      }
    );
  }

  async getTransactions(
    options: UserTransactionsParams
  ): Promise<Transaction[]> {
    const economyData = await Economy.findOne({ guildID: options.guildID });
    const user = economyData.users.find(
      (user) => user.userID === options.userID
    );

    return user.transactions;
  }

  async updateUserBankBalance(
    options: UpdateUserBankBalance
  ): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: options.guildID, "users.userID": options.userID },
      {
        $set: {
          "users.$.bankBalance": options.bankBalance,
        },
      }
    );
  }

  async updateUserAccountBalance(
    options: UpdateUserAccountBalance
  ): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: options.guildID, "users.userID": options.userID },
      {
        $set: {
          "users.$.accountBalance": options.accountBalance,
        },
      }
    );
  }

  async updateUserBalancesAndTransactions(
    options: UpdateBalancesAndTransactions
  ): Promise<GuildEconomy> {
    return await Economy.findOneAndUpdate(
      { guildID: options.guildID },
      {
        $set: {
          "users.$[sender].accountBalance":
            options.updatedSender.accountBalance,
          "users.$[sender].bankBalance": options.updatedSender.bankBalance,
          "users.$[recipient].accountBalance":
            options.updatedRecipient.accountBalance,
          "users.$[recipient].bankBalance":
            options.updatedRecipient.bankBalance,
        },
        $push: {
          "users.$[sender].transactions": {
            type: "payment",
            description: `Paid ${options.updatedRecipient.displayName} ${
              options.amount
            } ${options.economy.name.replace(/s$/, "")}${
              options.amount === 1 ? "" : "s"
            }`,
            amount: options.amount,
            time: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
          },
          "users.$[recipient].transactions": {
            type: "recieved",
            description: `Received ${
              options.amount
            } ${options.economy.name.replace(/s$/, "")}${
              options.amount === 1 ? "" : "s"
            } from ${options.updatedSender.displayName}`,
            amount: options.amount,
            time: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
          },
        },
      },
      {
        arrayFilters: [
          { "sender.userID": options.updatedSender.userID },
          { "recipient.userID": options.updatedRecipient.userID },
        ],
        new: true,
      }
    );
  }

  async updateUserPermissions(
    options: UpdateUserPrivacyPermissions
  ): Promise<UpdateResult> {
    const economy = await Economy.findOne({ guildID: options.guildID });
    const user = economy?.users.find((user) => user.userID === options.userID);

    const updateFields = {};

    options.selectedPermissions.forEach((permission) => {
      if (
        permission === "viewInventory" ||
        permission === "receiveNotifications"
      ) {
        updateFields[`users.$.privacySettings.${permission}`] =
          !user.privacySettings[permission];
      }
    });

    if (Object.keys(updateFields).length > 0) {
      return await Economy.updateOne(
        { guildID: options.guildID, "users.userID": options.userID },
        { $set: updateFields }
      );
    }
  }

  async updateUserMilestones(
    options: UpdateUserMilestones
  ): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: options.guildID, "users.userID": options.userID },
      {
        $push: {
          "users.$.milestones": options.milestone,
        },
      }
    );
  }

  async completePurchase(
    user: UserEconomy,
    item: Items,
    amount: number,
    interaction: ChatInputCommandInteraction<"cached">
  ) {
    if (item.type === "ingredient") {
      const foodItem = item as IngredientData;
      const itemsToAdd = Array(amount).fill({
        name: {
          singular: foodItem.name.singular,
          plural: foodItem.name.plural,
        },
        description: foodItem.description,
        type: foodItem.type,
        icon: foodItem.icon,
        price: foodItem.price,
        disabled: foodItem.disabled,
        amountPerUser: foodItem.amountPerUser,
      });

      await Economy.updateOne(
        { guildID: interaction.guildId, "users.userID": user.userID },
        {
          $push: {
            [`users.$.inventory.items.${item.type}`]: { $each: itemsToAdd },
          },
          $inc: {
            "users.$.accountBalance": -foodItem.price * amount,
          },
        }
      );
    } else if (item.type === "weapon") {
      const weaponItem = item as WeaponData;
      const itemsToAdd = Array(amount).fill({
        name: {
          singular: weaponItem.name.singular,
          plural: weaponItem.name.plural,
        },
        description: weaponItem.description,
        type: weaponItem.type,
        icon: weaponItem.icon,
        price: weaponItem.price,
        damage: weaponItem.damage,
        level: 0,
        uses: 0,
        amountPerUser: weaponItem.amountPerUser,
        weaponType: weaponItem.weaponType,
        durability: weaponItem.durability,
        disabled: weaponItem.disabled,
        purchasedAt: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"), // custom set
        requires: weaponItem.requires,
      });

      await Economy.updateOne(
        { guildID: interaction.guildId, "users.userID": user.userID },
        {
          $push: {
            [`users.$.inventory.items.${item.type}`]: { $each: itemsToAdd },
          },
          $inc: {
            "users.$.accountBalance": -weaponItem.price * amount,
          },
        }
      );
    } else if (item.type === "meal") {
      const mealItem = item as MealData;

      const itemstoAdd = Array(amount).fill({
        name: {
          singular: mealItem.name.singular,
          plural: mealItem.name.plural,
        },
        description: mealItem.description,
        type: mealItem.type,
        icon: mealItem.icon,
        price: mealItem.price,
        disabled: mealItem.disabled,
        amountPerUser: mealItem.amountPerUser,
        ingredientsRequired: mealItem.ingredientsRequired,
        effects: mealItem.effects,
      });

      await Economy.updateOne(
        { guildID: interaction.guildId, "users.userID": user.userID },
        {
          $push: {
            [`users.$.inventory.items.${item.type}`]: { $each: itemstoAdd },
          },
          $inc: {
            "users.$.accountBalance": -mealItem.price * amount,
          },
        }
      );
    } else if (item.type === "drink") {
      const drinkItem = item as DrinkData;

      const itemstoAdd = Array(amount).fill({
        name: {
          singular: drinkItem.name.singular,
          plural: drinkItem.name.plural,
        },
        description: drinkItem.description, // might not need this now
        type: drinkItem.type,
        icon: drinkItem.icon,
        price: drinkItem.price,
        disabled: drinkItem.disabled,
        amountPerUser: drinkItem.amountPerUser,
        effects: drinkItem.effects,
      });

      await Economy.updateOne(
        { guildID: interaction.guildId, "users.userID": user.userID },
        {
          $push: {
            [`users.$.inventory.items.${item.type}`]: { $each: itemstoAdd },
          },
          $inc: {
            "users.$.accountBalance": -drinkItem.price * amount,
          },
        }
      );
    }
  }

  async useFoodItem(
    guildID: string,
    userID: string,
    itemName: string,
    effects: Effect[],
    itemType: ItemType
  ) {
    try {
      const economy = await Economy.findOne({
        guildID,
        "users.userID": userID,
      });

      if (!economy) {
        console.error("No economy found for this guild.");
        return false;
      }

      const user = economy.users.find((user) => user.userID === userID);

      if (!user) {
        console.error("User not found.");
        return false;
      }

      const itemIndex = user.inventory.items[itemType].findIndex(
        (item) => item.name.singular === itemName
      );

      if (itemIndex === -1) {
        console.error("Item not found in user's inventory.");
        return false;
      }

      const item = user.inventory.items[itemType][itemIndex];

      // Check if the item has a valid description, if not, set a default description
      if (!item.description || item.description.trim() === "") {
        console.warn(
          `Item "${itemName}" is missing a description. Setting default description.`
        );
        item.description = "No description available.";
      }

      // Remove the item from the inventory
      user.inventory.items[itemType].splice(itemIndex, 1);

      // Apply the effects
      user.activeEffects = effects;

      await economy.save();
      return true;
    } catch (error) {
      console.error("Error using food item:", error);
      return false;
    }
  }

  async deleteEconomy(guildID: string): Promise<boolean> {
    try {
      const result = await Economy.deleteOne({ guildID });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting economy:", error);
      return false;
    }
  }
}

export class DatabaseItems {
  private client: DiscordClient;

  // Constructor to initialize the class with the client
  constructor(client: DiscordClient) {
    this.client = client;
  }

  // Method to get all items from various categories and filter out disabled ones
  getAllItems(): Items[] {
    const allItems = [
      ...Array.from(this.client.items.weapon.values()),
      ...Array.from(this.client.items.meal.values()),
      ...Array.from(this.client.items.ingredient.values()),
      ...Array.from(this.client.items.drink.values()),
    ];

    const filtered = allItems.filter((item) => !item.disabled);

    return filtered;
  }

  // Method to get items by a specific type, filter out disabled items, and return the correct type
  getItemsByType<T extends ItemType>(type: T) {
    const itemsIterator = this.client.items[type].values();
    const items: Items[] = [];

    for (const item of itemsIterator) {
      if (!item.disabled) {
        items.push(item);
      }
    }

    return items as T extends "weapon"
      ? WeaponData[]
      : T extends "meal"
      ? MealData[]
      : T extends "ingredient"
      ? IngredientData[]
      : T extends "drink"
      ? DrinkData[]
      : never;
  }

  // Method to get inventory items for a user, filter out disabled items, and optionally filter by item type
  getInventoryItems(economy: UserEconomy, itemType?: ItemType) {
    if (itemType) {
      return economy.inventory.items[itemType].filter((item) => !item.disabled);
    } else {
      return Object.values(economy.inventory.items)
        .flat()
        .filter((item) => !item.disabled);
    }
  }

  // Method to get the amount of a specific item in a user's inventory
  getInventoryItemAmount(
    user: UserEconomy,
    itemType: ItemType,
    itemName: string
  ): number {
    return user.inventory.items[itemType].filter(
      (existingItem) => existingItem.name.singular === itemName
    ).length;
  }
}

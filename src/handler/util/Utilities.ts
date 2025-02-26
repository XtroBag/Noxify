import { Mongoose, UpdateResult } from "mongoose";
import { DiscordClient } from "./DiscordClient";
import Logger from "./Logger";
import { Economy } from "../schemas/models/Models";
import {
  EconomyUser,
  Milestone,
  Transaction,
} from "../types/economy/EconomyUser";
import { GuildEconomy } from "../types/Database";
import { ChatInputCommandInteraction } from "discord.js";
import {
  Ammo,
  Drink,
  Item,
  ItemCategory,
  Items,
  ItemType,
  Meal,
  Weapon,
} from "../types/economy/EconomyItem";
import mongoose from "mongoose";

export class Utilities {
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  async databaseConnection(): Promise<Mongoose | void> {
    try {
      Logger.log("Successfully connected to MongoDB!");
      return await mongoose.connect(process.env.MONGOOSE_URI, {
        dbName: "Noxify",
        autoCreate: true,
      });
    } catch (error) {
      Logger.error("Database connection failed", error);
      throw error;
    }
  }

  formatNumber(amount: number): string {
    if (isNaN(amount)) return "Invalid number";
    return amount.toLocaleString();
  }

  generateCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length: 4 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
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

  formatNameByAmount({
    economy,
    amount,
  }: {
    economy: GuildEconomy;
    amount: number;
  }): string {
    return (
      economy.name.toLowerCase().replace(/s$/, "") + (amount === 1 ? "" : "s")
    );
  }

  generateHealthBar(health: number, showBar: boolean): string {
    if (!showBar) {
      return ""; // Return an empty string if the bar should not be shown
  }
  
      let bar = "";
      let healthBlocks = Math.floor(health / 10);
      let remainder = health % 10;

      for (let i = 0; i < 10; i++) {
        if (i < healthBlocks) {
          bar += "🟩"; // Full health segments
        } else if (i === healthBlocks && remainder > 0) {
          bar += "🟨"; // Partial health segment
        } else {
          bar += "🟥"; // Empty health segments
        }
      }

      return bar;

  }


  //---------------------------------------------------------------------------------------------

  async createEconomy({
    name,
    guildID,
    icon,
    defaultBalance,
    users = [],
  }: {
    name: string;
    guildID: string;
    icon: string;
    defaultBalance: number;
    users: EconomyUser[];
  }): Promise<GuildEconomy> {
    const economy = new Economy({
      name,
      guildID,
      icon,
      defaultBalance,
      users,
    });
    return economy.save();
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

  async getEconomy({
    guildID,
  }: {
    guildID: string;
  }): Promise<GuildEconomy | null> {
    return await Economy.findOne({ guildID });
  }

  async addUserToEconomy(
    user: EconomyUser & { guildID: string }
  ): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: user.guildID },
      {
        $push: { users: user },
      }
    );
  }

  async addMilestoneToUser({
    guildID,
    userID,
    milestone,
  }: {
    guildID: string;
    userID: string;
    milestone: Milestone;
  }): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID, "users.userID": userID },
      {
        $push: { "users.$.milestones": milestone },
      }
    );
  }

  async updateDisplayName({
    guildID,
    userID,
    name,
  }: {
    guildID: string;
    userID: string;
    name: string;
  }): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID, "users.userID": userID },
      {
        $set: { "users.$.displayName": name },
      }
    );
  }

  async updateJoinedDate({
    guildID,
    userID,
    date,
  }: {
    guildID: string;
    userID: string;
    date: Date;
  }): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID, "users.userID": userID },
      {
        $set: { "users.$.joined": date },
      }
    );
  }

  async setWalletBalance({
    guildID,
    userID,
    amount,
  }: {
    guildID: string;
    userID: string;
    amount: number;
  }): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID, "users.userID": userID },
      {
        $set: { "users.$.bankingAccounts.wallet": amount },
      }
    );
  }

  async setBankBalance({
    guildID,
    userID,
    amount,
  }: {
    guildID: string;
    userID: string;
    amount: number;
  }): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID, "users.userID": userID },
      {
        $set: { "users.$.bankingAccounts.bank": amount },
      }
    );
  }

  getAll(): Items[] {
    const allItems: Items[] = [];

    this.client.items.ingredients.map((item) => {
      return allItems.push(item);
    });
    this.client.items.drinks.map((item) => {
      return allItems.push(item);
    });
    this.client.items.meals.map((item) => {
      return allItems.push(item);
    });
    this.client.items.weapons.map((item) => {
      return allItems.push(item);
    });
    this.client.items.ammos.map((item) => {
      return allItems.push(item);
    });
    return allItems;
  }

  getInventoryItems<Type extends ItemType>(
    user: EconomyUser,
    itemType: Type
  ): ItemCategory[Type] {
    if (user.inventory[itemType]) {
      return Object.values(user.inventory[itemType]).filter(
        (item) => !item.disabled
      ) as ItemCategory[Type];
    } else {
      return [] as ItemCategory[Type];
    }
  }

  getItemsByType<Type extends ItemType>(type: Type): ItemCategory[Type] {
    const itemsIterator = this.client.items[type].values();

    const items: ItemCategory[Type] = [];

    for (const item of itemsIterator) {
      if (!item.disabled) {
        items.push(item as Item & Meal & Drink & Weapon & Ammo);
      }
    }

    return items;
  }

  getTotalItemAmount() {
    const items = this.getAll();
    return items.length ?? "None";
  }

  async getTransactions({
    guildID,
    userID,
  }: {
    guildID: string;
    userID: string;
  }): Promise<Transaction[]> {
    const economy = await this.getEconomy({ guildID });
    const user = economy.users.find((user) => user.userID === userID);

    return user.transactions;
  }

  async addTransaction({
    guildID,
    userID,
    transaction,
  }: {
    guildID: string;
    userID: string;
    transaction: Transaction;
  }): Promise<UpdateResult> {
    return await Economy.updateOne(
      { guildID: guildID, "users.userID": userID },
      { $push: { "users.$.transactions": transaction } }
    );
  }

  async addMealToInventory({
    guildID,
    userID,
    meal,
    items,
    quantity,
  }: {
    guildID: string;
    userID: string;
    meal: Meal;
    items: Item[];
    quantity: number;
  }) {

    const updatedIngredients: Item[] = [];

    for (const ingredient of meal.ingredientsRequired) {
      const amountNeeded = ingredient.amountNeeded * quantity;
      const userIngredient = items.find(
        (userItem) => userItem.name.singular === ingredient.name
      );

      if (userIngredient && userIngredient.price >= amountNeeded) {
        userIngredient.price -= amountNeeded;

        updatedIngredients.push(userIngredient);
      }
    }

    const mealsToAdd: Meal[] = [];
    for (let i = 0; i < quantity; i++) {
      mealsToAdd.push({
        ...meal,
        ingredientsRequired: meal.ingredientsRequired,
        effects: meal.effects,
      });
    }

    await Economy.updateOne(
      { guildID: guildID, "users.userID": userID },
      {
        $push: {
          "users.$.inventory.meals": { $each: mealsToAdd },
        },
        $set: {
          "users.$.inventory.ingredients": updatedIngredients,
        },
      }
    );
  }

  async updatePrivacyOptions({
    guildID,
    userID,
    selectedPermissions,
  }: {
    guildID: string;
    userID: string;
    selectedPermissions: string[];
  }): Promise<UpdateResult> {
    const economy = await Economy.findOne({ guildID, "users.userID": userID });
    if (!economy) return;

    const user = economy.users.find((u) => u.userID === userID);
    if (!user) return;

    const permissions = ["viewInventory", "receiveNotifications"];

    const updateFields = selectedPermissions.reduce((fields, permission) => {
      if (permissions.includes(permission)) {
        const newValue = !user.privacyOptions[permission];
        fields[`users.$.privacyOptions.${permission}`] = newValue;
      }
      return fields;
    }, {});

    if (Object.keys(updateFields).length > 0) {
      return await Economy.updateOne(
        { guildID, "users.userID": userID },
        { $set: updateFields }
      );
    }
  }

  async updateUserBalancesAndTransactions({
    guildID,
    amount,
    economy,
    updatedSender,
    updatedRecipient,
  }: {
    guildID: string;
    amount: number;
    economy: GuildEconomy;
    updatedSender: EconomyUser;
    updatedRecipient: EconomyUser;
  }): Promise<GuildEconomy> {
    return await Economy.findOneAndUpdate(
      { guildID: guildID },
      {
        $set: {
          "users.$[sender].bankingAccounts.wallet":
            updatedSender.bankingAccounts.wallet,
          "users.$[sender].bankingAccounts.bank":
            updatedSender.bankingAccounts.bank,
          "users.$[recipient].bankingAccounts.wallet":
            updatedRecipient.bankingAccounts.wallet,
          "users.$[recipient].bankingAccounts.bank":
            updatedRecipient.bankingAccounts.bank,
        },
        $push: {
          "users.$[sender].transactions": {
            type: "payment",
            description: `Paid ${updatedRecipient.displayName
              } ${amount} ${economy.name.toLowerCase().replace(/s$/, "")}${amount === 1 ? "" : "s"
              }`,
            amount: amount,
            time: new Date(),
          },
          "users.$[recipient].transactions": {
            type: "recieved",
            description: `Received ${amount} ${economy.name.replace(
              /s$/,
              ""
            )} ${economy.name.toLowerCase().replace(/s$/, "")}${amount === 1 ? "" : "s"
              } from ${updatedSender.displayName}`,
            amount: amount,
            time: new Date(),
          },
        },
      },
      {
        arrayFilters: [
          { "sender.userID": updatedSender.userID },
          { "recipient.userID": updatedRecipient.userID },
        ],
        new: true,
      }
    );
  }

  async completePurchase({
    user,
    item,
    amount,
    guildID,
  }: {
    user: EconomyUser;
    item: Items;
    amount: number;
    guildID: string;
  }) {
    const itemData = {
      name: {
        singular: item.name.singular,
        plural: item.name.plural,
      },
      description: item.description,
      shopType: item.shopType,
      icon: item.icon,
      price: item.price,
      amountPerUser: item.amountPerUser,
    };

    let itemsToAdd: Items[] = [];

    switch (item.shopType) {
      case "ingredients": {
        itemsToAdd = Array(amount).fill({
          ...itemData,
        });
        break;
      }

      case "weapons": {
        const weaponItem = item as Weapon;
        itemsToAdd = Array(amount).fill({
          ...itemData,
          damage: weaponItem.damage,
          level: 0,
          weaponType: weaponItem.weaponType,
          uses: weaponItem.uses,
          purchasedAt: new Date().toDateString(),
          requires: weaponItem.requires,
        }) as Weapon[];
        break;
      }

      case "meals": {
        const mealItem = item as Meal;
        itemsToAdd = Array(amount).fill({
          ...itemData,
          ingredientsRequired: mealItem.ingredientsRequired,
          effects: mealItem.effects,
        }) as Meal[];
        break;
      }

      case "drinks": {
        const drinkItem = item as Drink;
        itemsToAdd = Array(amount).fill({
          ...itemData,
          effects: drinkItem.effects,
          ingredientsRequired: drinkItem.ingredientsRequired,
        }) as Drink[];
        break;
      }

      case "ammos": {
        const ammoItem = item as Ammo;
        itemsToAdd = Array(amount).fill({
          ...itemData,
          speed: ammoItem.speed,
          specialEffects: ammoItem.specialEffects,
        }) as Ammo[];
        break;
      }

      default:
        return;
    }

    const updateData = {
      $push: {
        [`users.$.inventory.${item.shopType}`]: { $each: itemsToAdd },
      },
      $inc: {
        "users.$.bankingAccounts.wallet": -item.price * amount,
      },
    };

    await Economy.updateOne(
      { guildID: guildID, "users.userID": user.userID },
      updateData
    );
  }
}

import Logger from "./Logger";
import { DiscordClient } from "./DiscordClient";
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
  FoodData,
  WeaponData,
} from "../types/Database";
import { format, parse } from "date-fns";
import { ChatInputCommandInteraction } from "discord.js";
import { Mongoose, UpdateResult } from "mongoose";
import { Effect } from "../types/Item";

export async function connectDatabase(
  client: DiscordClient,
  options: DatabaseOptions
): Promise<Mongoose | void> {
  if (options.enabled) {
    Logger.log("MongoDB connected successfully!");
    return await client.db.connect(process.env.MONGOOSE_URI, {
      dbName: "Noxify",
      autoCreate: true,
    });
  } else {
    Logger.log("MongoDB disconnected!");
    return await client.db.disconnect();
  }
}

export function formatAmount(amount: number): string {
  if (isNaN(amount)) return "Invalid number";
  return amount.toLocaleString();
}

export function generateRandomCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

export function convertTimeToDiscordTimestamp(timeString: string): string {
  const timeFormat = "EEEE, MMMM d, yyyy 'at' h:mm a";
  const parsedDate = parse(timeString, timeFormat, new Date());
  const discordTimestamp = Math.floor(parsedDate.getTime() / 1000);
  return `<t:${discordTimestamp}:R>`;
}

export function isServerEmojiValid(
  emoji: string,
  interaction: ChatInputCommandInteraction<"cached">
): boolean {
  // Check for custom emoji format (animated or non-animated)
  const customEmojiRegex = /<a?:([a-zA-Z0-9_]+):([0-9]+)>/;
  const match = emoji.match(customEmojiRegex);

  if (match) {
    const emojiId = match[2];
    const serverEmojis = interaction.guild.emojis.cache;
    return serverEmojis.has(emojiId); // Check if the emoji exists in the server
  }

  // Check for default emoji format (e.g., :gem:, :smile:, etc.)
  const defaultEmojiRegex = /:([a-zA-Z0-9_]+):/;
  const defaultMatch = emoji.match(defaultEmojiRegex);

  if (defaultMatch) {
    return true; // Valid default emoji format (like :gem:, :smile:, etc.)
  }

  // Check for Unicode emojis (standard range for most emojis)
  const unicodeEmojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/u;
  return unicodeEmojiRegex.test(emoji); // Check if it's a valid Unicode emoji
}

export function createEconomy(options: GuildEconomy): Promise<GuildEconomy> {
  return new Economy({
    name: options.name,
    guildID: options.guildID,
    icon: options.icon,
    defaultBalance: options.defaultBalance,
    users: options.users || [],
  }).save();
}

export async function getEconomy(
  options: EconomySearchParams
): Promise<GuildEconomy> {
  return await Economy.findOne({ guildID: options.guildID });
}

export async function addEconomyUser(
  options: AddUserParams
): Promise<UpdateResult> {
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

export async function addTransaction(
  options: AddTransactionParams
): Promise<UpdateResult> {
  return await Economy.updateOne(
    { guildID: options.guildID, "users.userID": options.userID },
    { $push: { "users.$.transactions": options.transaction } }
  );
}

export async function updateBalances(
  options: UpdateBalanceParams
): Promise<UpdateResult> {
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

export async function getTransactions(
  options: UserTransactionsParams
): Promise<Transaction[]> {
  const economyData = await Economy.findOne({ guildID: options.guildID });
  const user = economyData.users.find((user) => user.userID === options.userID);

  return user.transactions;
}

export async function updateUserBankBalance(
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

export async function updateUserAccountBalance(
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

export async function updateUserBalancesAndTransactions(
  options: UpdateBalancesAndTransactions
): Promise<GuildEconomy> {
  return await Economy.findOneAndUpdate(
    { guildID: options.guildID },
    {
      $set: {
        "users.$[sender].accountBalance": options.updatedSender.accountBalance,
        "users.$[sender].bankBalance": options.updatedSender.bankBalance,
        "users.$[recipient].accountBalance":
          options.updatedRecipient.accountBalance,
        "users.$[recipient].bankBalance": options.updatedRecipient.bankBalance,
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

export async function updateUserPermissions(
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

export async function updateUserMilestones(
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

export async function completePurchase(
  user: UserEconomy,
  item: Items,
  amount: number,
  interaction: ChatInputCommandInteraction<"cached">
) {
  if (item.type === "food") {
    const foodItem = item as FoodData;
    const itemsToAdd = Array(amount).fill({
      name: { singular: foodItem.name.singular, plural: foodItem.name.plural },
      description: foodItem.description,
      type: foodItem.type,
      icon: foodItem.icon,
      price: foodItem.price,
      effects: foodItem.effects,
      disabled: foodItem.disabled,
      drinkable: foodItem.drinkable,
      amountPerUser: foodItem.amountPerUser,
      uses: 0,
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
  }
}

export async function useFoodItem(
  guildID: string,
  userID: string,
  itemName: string,
  effects: Effect[]
) {
  try {
    const economy = await Economy.findOne({ guildID, "users.userID": userID });

    const user = economy.users.find((user) => user.userID === userID);

    const itemIndex = user.inventory.items.food.findIndex(
      (item) => item.name.singular === itemName
    );

    user.inventory.items.food.splice(itemIndex, 1);
    user.activeEffects = effects;

    await economy.save();

    return true;
  } catch (error) {
    console.error("Error using food item:", error);
    return false;
  }
}


export async function deleteEconomy(guildID: string): Promise<boolean> {
  try {
    // Delete the economy for the given guildID
    const result = await Economy.deleteOne({ guildID });

    // Check if a document was deleted
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting economy:", error);
    return false; // Return false if there was an error
  }
}
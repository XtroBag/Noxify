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
  Milestone,
  UpdateUserBankBalance,
  UpdateUserAccountBalance,
  UpdateUserPrivacyPermissions,
  UpdateUserMilestones,
} from "../types/Database";
import { format, parse } from "date-fns";
import { ChatInputCommandInteraction } from "discord.js";
import { Mongoose, UpdateResult } from "mongoose";

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

export function isEmojiFormatValid(input: string): boolean {
  const customEmojiRegex = /^<:[a-zA-Z0-9_]+:[0-9]+>$/;
  if (customEmojiRegex.test(input)) {
    return true;
  }

  const unicodeEmojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Emoji_Modifier_Base})(?:\uFE0F?)$/u;
  if (unicodeEmojiRegex.test(input)) {
    return true;
  }

  return false;
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
  const customEmojiRegex = /<a?:([a-zA-Z0-9_]+):([0-9]+)>/;
  const match = emoji.match(customEmojiRegex);

  if (match) {
    const emojiId = match[2];
    const serverEmojis = interaction.guild.emojis.cache;
    return serverEmojis.has(emojiId);
  }

  const unicodeEmojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/u;
  return unicodeEmojiRegex.test(emoji);
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

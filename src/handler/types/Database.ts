import { Effect, FoodShopItem, WeaponShopItem, WeaponType } from "./Item";

export interface ServerData {
  name: string;
  guildID: string;
  prefix: string;
  loggingChannel: string;
  loggingActive: boolean;
}

export interface Transaction {
  type: string;
  description: string;
  amount: number;
  time: string;
}

export interface Milestone {
  amount: number;
  reachedAt: string;
  finished: boolean;
}

//--------------------------------------------------------------------------------

export type Items = WeaponData | FoodData;

export interface UserInventory {
  items: {
    weapons: WeaponData[],
    foods: FoodData[]
  }
}

export interface FoodData extends FoodShopItem {
  uses: number;
}

export interface WeaponData extends WeaponShopItem {
  uses: number;
  level: number;
  purchasedAt: string;
}

//--------------------------------------------------------------------------------

export interface UserEconomy {
  displayName: string;
  userID: string;
  joined: string;
  accountBalance: number;
  bankBalance: number;
  privacySettings: UserPrivacy;
  milestones: Milestone[];
  transactions: Transaction[];
  inventory: UserInventory;
}

export interface UserPrivacy {
  viewInventory: boolean;
  receiveNotifications: boolean;
  purchaseWarnings: boolean;
}

export interface GuildEconomy {
  name: string;
  guildID: string;
  icon: string;
  defaultBalance: number;
  users: UserEconomy[];
}

export type DatabaseOptions = {
  enabled: boolean;
};

export type EconomySearchParams = {
  guildID: string;
};

type GuildParams = {
  guildID: string;
};

export type AddUserParams = GuildParams & UserEconomy;

export type AddTransactionParams = {
  guildID: string;
  userID: string;
  transaction: Transaction;
};

export type UpdateBalanceParams = {
  guildID: string;
  userID: string;
  accountBalance: number;
  bankBalance: number;
};

export type UserTransactionsParams = {
  guildID: string;
  userID: string;
};

export type UpdateBalancesAndTransactions = {
  guildID: string;
  amount: number;
  economy: GuildEconomy;
  updatedSender: UserEconomy;
  updatedRecipient: UserEconomy;
};

export type UpdateUserBankBalance = {
  guildID: string;
  userID: string;
  bankBalance: number;
};

export type UpdateUserAccountBalance = {
  guildID: string;
  userID: string;
  accountBalance: number;
};

export type UpdateUserPrivacyPermissions = {
  guildID: string;
  userID: string;
  selectedPermissions: string[];
};

export type UpdateUserMilestones = {
  guildID: string;
  userID: string;
  milestone: Milestone;
};

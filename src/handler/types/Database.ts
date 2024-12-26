export interface GuildData {
  name: string;
  guildID: string;
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

export interface UserEconomy {
  displayName: string;
  userID: string;
  joined: string;
  accountBalance: number;
  bankBalance: number;
  privacySettings: UserPrivacy;
  milestones: Milestone[];
  transactions: Transaction[];
}

export interface UserPrivacy {
  viewInventory: boolean;
  receiveNotifications: boolean;
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

import { Drink, Effect, Item, Meal, Weapon } from "./EconomyItem";

export interface Milestone {
  amount: number;
  recieved: string;
  finished: boolean;
}

export interface Transaction {
  type: "Deposit" | "Withdraw" | "Transfer" | "Send";
  description: string;
  amount: number;
  time: Date;
}

export interface PrivacyOptions {
  viewInventory: boolean;
  receiveNotifications: boolean;
}

export interface UserInventory {
  ingredients: Item[];
  weapons: Weapon[];
  meals: Meal[];
  drinks: Drink[];
}

export interface BankingAccounts {
  wallet: number;
  bank: number;
}

export interface EconomyUser {
  displayName: string;
  userID: string;
  joined: Date;
  bankingAccounts: {
    wallet: number;
    bank: number;
  };
  privacyOptions: {
    viewInventory: boolean;
    receiveNotifications: boolean;
  };
  inventory: {
    ingredients: Item[];
    weapons: Weapon[];
    meals: Meal[];
    drinks: Drink[];
  };
  milestones: Milestone[];
  transactions: Transaction[];
  effects: Effect[];
}

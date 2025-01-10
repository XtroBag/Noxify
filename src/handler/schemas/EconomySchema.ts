import { Schema, SchemaTypes } from "mongoose";
import {
  Transaction,
  UserEconomy,
  UserPrivacy,
  Milestone,
  UserInventory,
  FoodData,
  WeaponData,
} from "../types/Database";
import { Effect, NameStyles } from "../types/Item";

// Define the Transaction Schema
export const TransactionSchema = new Schema<Transaction>({
  type: { type: SchemaTypes.String, required: true },
  description: { type: SchemaTypes.String, required: true },
  amount: { type: SchemaTypes.Number, required: true },
  time: { type: SchemaTypes.String, required: true },
});

// Define the EconomyUserPrivacy Schema
export const EconomyUserPrivacy = new Schema<UserPrivacy>({
  viewInventory: { type: SchemaTypes.Boolean, default: false },
  receiveNotifications: { type: SchemaTypes.Boolean, default: true },
});

// Define the Milestone Schema
export const EconomyMilestone = new Schema<Milestone>({
  amount: { type: SchemaTypes.Number, required: true },
  reachedAt: { type: SchemaTypes.String, required: true },
  finished: { type: SchemaTypes.Boolean, default: false, required: true },
});

export const ItemName = new Schema<NameStyles>({
  singular: { type: SchemaTypes.String, required: true },
  plural: { type: SchemaTypes.String, required: true }
})

export const FoodEffect = new Schema<Effect>({
  name: { type: SchemaTypes.String, required: true },
  lasts: { type: SchemaTypes.Number, required: true }
})

export const WeaponSchema = new Schema<WeaponData>({
  name: { type: ItemName, required: true }, // name is now plural and singular
  description: { type: SchemaTypes.String, required: true },
  type: { type: SchemaTypes.String, required: true },
  icon: { type: SchemaTypes.String, required: true },
  weaponType: { type: SchemaTypes.String, required: true },
  purchasedAt: { type: SchemaTypes.String, required: true },
  price: { type: SchemaTypes.Number, required: true },
  level: { type: SchemaTypes.Number, required: true },
  uses: { type: SchemaTypes.Number, required: true },
  damage: { type: SchemaTypes.Number, required: true },
  durability: { type: SchemaTypes.Mixed, required: true },
  disabled: { type: SchemaTypes.Boolean, required: true },
  amountPerUser: { type: SchemaTypes.Mixed, required: true },
  requires: { type: SchemaTypes.Mixed, required: true }
});

export const FoodSchema = new Schema<FoodData>({
  name: { type: ItemName, required: true },
  description: { type: SchemaTypes.String, required: true },
  type: { type: SchemaTypes.String, required: true },
  icon: { type: SchemaTypes.String, required: true },
  price: { type: SchemaTypes.Number, required: true },
  disabled: { type: SchemaTypes.Boolean, required: true },
  drinkable: { type: SchemaTypes.Boolean, required: true },
  effects: { type: [FoodEffect], required: true },
  uses: { type: SchemaTypes.Number, required: true },
  amountPerUser: { type: SchemaTypes.Mixed, required: true }
});

export const EconomyUserInventory = new Schema<UserInventory>({
  items: {
    weapon: [WeaponSchema],
    food: [FoodSchema],
  },
});

// Define the EconomyUser Schema
export const EconomyUserSchema = new Schema<UserEconomy>({
  displayName: { type: SchemaTypes.String, required: true },
  userID: { type: SchemaTypes.String, required: true },
  joined: { type: SchemaTypes.String, required: true },
  accountBalance: { type: SchemaTypes.Number, default: 0 },
  bankBalance: { type: SchemaTypes.Number, default: 0 },
  privacySettings: { type: EconomyUserPrivacy, default: {} },
  milestones: { type: [EconomyMilestone], default: [] },
  transactions: { type: [TransactionSchema], default: [] },
  inventory: { type: EconomyUserInventory, default: {} },
});

// Define the Guild Economy Schema
export const EconomySchema = new Schema({
  name: { type: SchemaTypes.String, required: true },
  guildID: { type: SchemaTypes.String, required: true },
  icon: { type: SchemaTypes.String, required: true },
  defaultBalance: { type: SchemaTypes.Number, required: true },
  users: { type: [EconomyUserSchema], default: [] },
});

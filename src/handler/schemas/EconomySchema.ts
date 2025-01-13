import { Schema, SchemaTypes } from "mongoose";
import {
  Transaction,
  UserEconomy,
  UserPrivacy,
  Milestone,
  UserInventory,
  MealData,
  DrinkData,
  WeaponData,
  IngredientData,
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
  singular: { type: SchemaTypes.String, required: true, default: "No name available" },
  plural: { type: SchemaTypes.String, required: true, default: "No name available" },
});

export const FoodEffect = new Schema<Effect>({
  name: { type: SchemaTypes.String, required: true },
  lasts: { type: SchemaTypes.Number, required: true },
});

export const WeaponSchema = new Schema<WeaponData>({
  name: { type: ItemName, required: true },
  description: { type: SchemaTypes.String, required: true, default: "No description available" },
  type: { type: SchemaTypes.String, required: true, default: 'weapon' },
  icon: { type: SchemaTypes.String, required: true, default: "No icon available" },
  weaponType: { type: SchemaTypes.String, required: true, default: "other" },
  purchasedAt: { type: SchemaTypes.String, required: true, default: "no purchasedAt available" },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  level: { type: SchemaTypes.Number, required: true, default: 0 },
  uses: { type: SchemaTypes.Number, required: true, default: 0 },
  damage: { type: SchemaTypes.Number, required: true, default: 0 },
  durability: { type: SchemaTypes.Mixed, required: true, default: "unlimited" },
  disabled: { type: SchemaTypes.Boolean, required: true, default: false },
  amountPerUser: {
    type: SchemaTypes.Mixed,
    required: true,
    default: "unlimited",
  },
  requires: { type: SchemaTypes.Mixed, required: true, default: [] },
});

export const MealSchema = new Schema<MealData>({
  name: { type: ItemName, required: true },
  description: { type: SchemaTypes.String, required: true, default: "No description available" },
  type: { type: SchemaTypes.String, required: true, default: 'meal' },
  icon: { type: SchemaTypes.String, required: true, default: "No icon available" },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: true, default: false },
  effects: { type: [FoodEffect], required: true, default: [] },
  ingredientsRequired: { type: [SchemaTypes.String], required: true, default: [] },
  amountPerUser: { type: SchemaTypes.Mixed, required: true, default: 0 },
});

export const ingredientSchema = new Schema<IngredientData>({
  name: { type: ItemName, required: true },
  description: { type: SchemaTypes.String, required: true, default: "No description available" },
  type: { type: SchemaTypes.String, required: true, default: 'ingredient' },
  icon: { type: SchemaTypes.String, required: true, default: "No icon available" },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: true, default: false },
  amountPerUser: {
    type: SchemaTypes.Mixed,
    required: true,
    default: "unlimited",
  }
});

export const drinkSchema = new Schema<DrinkData>({
  name: { type: ItemName, required: true },
  description: { type: SchemaTypes.String, required: true, default: 'No description available' },
  type: { type: SchemaTypes.String, required: true, default: 'drink' },
  icon: { type: SchemaTypes.String, required: true, default: "No icon available" },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: true, default: false },
  amountPerUser: { type: SchemaTypes.Mixed, required: true, default: "unlimited" },
  effects: { type: [FoodEffect], required: true, default: [] },
});

export const EconomyUserInventory = new Schema<UserInventory>({
  items: {
    weapon: [WeaponSchema],
    meal: [MealSchema],
    ingredient: [ingredientSchema],
    drink: [drinkSchema]
    
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
  activeEffects: { type: [FoodEffect], required: true, default: [] }
});

// Define the Guild Economy Schema
export const EconomySchema = new Schema({
  name: { type: SchemaTypes.String, required: true },
  guildID: { type: SchemaTypes.String, required: true },
  icon: { type: SchemaTypes.String, required: true },
  defaultBalance: { type: SchemaTypes.Number, required: true },
  users: { type: [EconomyUserSchema], default: [] },
});

import { Schema, SchemaTypes } from "mongoose";
import {
  BankingAccounts,
  EconomyUser,
  Milestone,
  PrivacyOptions,
  Transaction,
  UserInventory,
} from "../types/economy/EconomyUser";
import {
  Ammo,
  Drink,
  Effect,
  Item,
  Meal,
  NameStyles,
  RequiredIngredient,
  Weapon,
} from "../types/economy/EconomyItem";

export const TransactionSchema = new Schema<Transaction>({
  type: { type: SchemaTypes.String, required: true },
  description: { type: SchemaTypes.String, required: true },
  amount: { type: SchemaTypes.Number, required: true },
  time: { type: SchemaTypes.Date, required: true },
});

export const EconomyUserPrivacy = new Schema<PrivacyOptions>({
  viewInventory: { type: SchemaTypes.Boolean, default: false },
  receiveNotifications: { type: SchemaTypes.Boolean, default: true },
});

export const EconomyMilestone = new Schema<Milestone>({
  amount: { type: SchemaTypes.Number, required: true },
  recieved: { type: SchemaTypes.String, required: true },
  finished: { type: SchemaTypes.Boolean, default: false, required: true },
});

export const ItemName = new Schema<NameStyles>({
  singular: {
    type: SchemaTypes.String,
    required: true,
    default: "No name available",
  },
  plural: {
    type: SchemaTypes.String,
    required: true,
    default: "No name available",
  },
});

export const FoodEffect = new Schema<Effect>({
  name: { type: SchemaTypes.String, required: true },
  lasts: { type: SchemaTypes.Number, required: true },
});

export const MealIngredient = new Schema<RequiredIngredient>({
  name: { type: SchemaTypes.String, required: true },
  amountNeeded: { type: SchemaTypes.Number, required: true, default: 0 },
});

export const WeaponSchema = new Schema<Weapon>({
  name: { type: ItemName, required: true },
  description: {
    type: SchemaTypes.String,
    required: true,
    default: "No description available",
  },
  purchasedAt: {
    type: SchemaTypes.Date,
    required: true,
  },
  shopType: { type: SchemaTypes.String, required: true, default: "weapons" },
  icon: {
    type: SchemaTypes.String,
    required: true,
    default: "No icon available",
  },
  weaponType: { type: SchemaTypes.String, required: true, default: "Other" },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  level: { type: SchemaTypes.Number, required: true, default: 0 },
  damage: { type: SchemaTypes.Number, required: true, default: 0 },
  uses: { type: SchemaTypes.Mixed, required: true, default: "Infinite" },
  disabled: { type: SchemaTypes.Boolean, required: false },
  amountPerUser: {
    type: SchemaTypes.Mixed,
    required: true,
    default: "Infinite",
  },
  requires: { type: SchemaTypes.Mixed, required: true, default: [] },
});

export const MealSchema = new Schema<Meal>({
  name: { type: ItemName, required: true },
  description: {
    type: SchemaTypes.String,
    required: true,
    default: "No description available",
  },
  shopType: { type: SchemaTypes.String, required: true, default: "meals" },
  icon: {
    type: SchemaTypes.String,
    required: true,
    default: "No icon available",
  },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: false },
  effects: { type: [FoodEffect], required: true, default: [] },
  ingredientsRequired: { type: [MealIngredient], required: true, default: [] },
  amountPerUser: { type: SchemaTypes.Mixed, required: true, default: 0 },
});

export const ingredientSchema = new Schema<Item>({
  name: { type: ItemName, required: true },
  description: {
    type: SchemaTypes.String,
    required: true,
    default: "No description available",
  },
  shopType: { type: SchemaTypes.String, required: true, default: "ingredients" },
  icon: {
    type: SchemaTypes.String,
    required: true,
    default: "No icon available",
  },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: false },
  amountPerUser: {
    type: SchemaTypes.Mixed,
    required: true,
    default: "Infinite",
  },
});

export const drinkSchema = new Schema<Drink>({
  name: { type: ItemName, required: true },
  description: {
    type: SchemaTypes.String,
    required: true,
    default: "No description available",
  },
  shopType: { type: SchemaTypes.String, required: true, default: "drinks" },
  icon: {
    type: SchemaTypes.String,
    required: true,
    default: "No icon available",
  },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: false },
  amountPerUser: {
    type: SchemaTypes.Mixed,
    required: true,
    default: "Infinite",
  },
  effects: { type: [FoodEffect], required: true, default: [] },
});

export const ammoSchema = new Schema<Ammo>({
  name: { type: ItemName, required: true },
  description: {
    type: SchemaTypes.String,
    required: true,
    default: "No description available",
  },
  shopType: { type: SchemaTypes.String, required: true, default: "drinks" },
  icon: {
    type: SchemaTypes.String,
    required: true,
    default: "No icon available",
  },
  price: { type: SchemaTypes.Number, required: true, default: 0 },
  disabled: { type: SchemaTypes.Boolean, required: false },
  amountPerUser: {
    type: SchemaTypes.Mixed,
    required: true,
    default: "Infinite",
  },
  specialEffects: { type: [String], required: true, default: [] },
  speed: { type: SchemaTypes.Number, required: true, default: 0 },

})

export const EconomyUserInventory = new Schema<UserInventory>({
  weapons: [WeaponSchema],
  meals: [MealSchema],
  ingredients: [ingredientSchema],
  drinks: [drinkSchema],
  ammos: [ammoSchema],
});

export const EconomyUserAccounts = new Schema<BankingAccounts>({
  wallet: { type: SchemaTypes.Number, required: true, default: 0 },
  bank: { type: SchemaTypes.Number, required: true, default: 0 },
});

export const EconomyUserSchema = new Schema<EconomyUser>({
  displayName: { type: SchemaTypes.String, required: true },
  userID: { type: SchemaTypes.String, required: true },
  joined: { type: SchemaTypes.Date, required: true },
  bankingAccounts: { type: EconomyUserAccounts, required: true, default: {} },
  privacyOptions: { type: EconomyUserPrivacy, default: {} },
  inventory: { type: EconomyUserInventory, default: {} },
  milestones: { type: [EconomyMilestone], default: [] },
  transactions: { type: [TransactionSchema], default: [] },
  effects: { type: [FoodEffect], required: true, default: [] },
});

export const EconomySchema = new Schema({
  name: { type: SchemaTypes.String, required: true },
  guildID: { type: SchemaTypes.String, required: true },
  icon: { type: SchemaTypes.String, required: true },
  defaultBalance: { type: SchemaTypes.Number, required: true },
  users: { type: [EconomyUserSchema], default: [] },
});

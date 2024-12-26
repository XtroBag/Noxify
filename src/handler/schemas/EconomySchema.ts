import { Schema, SchemaTypes } from "mongoose";
import {
  Transaction,
  UserEconomy,
  UserPrivacy,
  Milestone
} from "../types/Database";

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
});


// Define the Guild Economy Schema
export const EconomySchema = new Schema({
  name: { type: SchemaTypes.String, required: true },
  guildID: { type: SchemaTypes.String, required: true },
  icon: { type: SchemaTypes.String, required: true },
  defaultBalance: { type: SchemaTypes.Number, required: true },
  users: { type: [EconomyUserSchema], default: [] },
});

import { Schema, SchemaTypes } from "mongoose";
import { AutoSlowMode, AutoWelcome, ServerData } from "../Types/Database.js";
import { defaultPrefix } from "../../config.js";

export const AutoSlowModeSchema = new Schema<AutoSlowMode>({
  enabled: { type: Boolean, default: false, required: false },
  shortestTime: { type: Number, default: 10, required: false },
  moderateTime: { type: Number, default: 30, required: false },
  highestTime: { type: Number, default: 60, required: false },
  messageCounts: {
    type: [{ timestamp: Number, count: Number }],
    default: [],
    required: false,
  },
  channels: { type: [String], default: [], required: false },
});

export const AutoWelcomeSchema = new Schema<AutoWelcome>({
  enabled: { type: Boolean, default: false, required: false },
  message: { type: String, default: "", required: false },
  channel: { type: String, default: "", required: false },
})

export const ServerSchema = new Schema<ServerData>({
  name: { type: String, required: true },
  guildID: { type: String, required: true },
  prefix: { type: String, default: defaultPrefix },
  loggingChannel: { type: SchemaTypes.String, default: "" },
  loggingActive: { type: SchemaTypes.Boolean, default: false },
  autoSlowmode: { type: AutoSlowModeSchema, default: {}, required: false },
  autoWelcome: { type: AutoWelcomeSchema, default: {}, required: false },
});

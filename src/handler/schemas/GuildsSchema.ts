import { Schema, SchemaTypes } from "mongoose";
import { AutoSlowMode, ServerData } from "../types/Database";
import { defaultPrefix } from "../../config";

export const AutoSlowModeSchema = new Schema<AutoSlowMode>({
  enabled: { type: Boolean, default: false, required: true },
  shortestTime: { type: Number, default: 10, required: true },
  moderateTime: { type: Number, default: 30, required: true },
  highestTime: { type: Number, default: 60, required: true },
  messageCounts: {
    type: [{ timestamp: Number, count: Number }],
    default: [],
    required: true,
  },
  channels: { type: [String], default: [], required: true },
});

export const ServerSchema = new Schema<ServerData>({
  name: { type: String, required: true },
  guildID: { type: String, required: true },
  prefix: { type: String, default: defaultPrefix },
  loggingChannel: { type: SchemaTypes.String, default: "" },
  loggingActive: { type: SchemaTypes.Boolean, default: false },
  autoSlowmode: { type: AutoSlowModeSchema, default: {}, required: true },
});

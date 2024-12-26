import { Schema, SchemaTypes } from "mongoose";
import { GuildData } from "../types/Database";

export const GuildSchema = new Schema<GuildData>({
  name: { type: String, required: true },
  guildID: { type: String, required: true },
  loggingChannel: { type: SchemaTypes.String, required: true, default: '' },
  loggingActive: { type: SchemaTypes.Boolean, required: true, default: true }
});



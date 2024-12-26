import { Schema, SchemaTypes } from "mongoose";
import { ServerData } from "../types/Database";

export const ServerSchema = new Schema<ServerData>({
  name: { type: String, required: true },
  guildID: { type: String, required: true },
  loggingChannel: { type: SchemaTypes.String, default: '' },
  loggingActive: { type: SchemaTypes.Boolean, default: false }
});



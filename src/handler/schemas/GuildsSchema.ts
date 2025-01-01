import { Schema, SchemaTypes } from "mongoose";
import { ServerData } from "../types/Database";
import { defaultPrefix } from "../../config";

export const ServerSchema = new Schema<ServerData>({
  name: { type: String, required: true },
  guildID: { type: String, required: true },
  prefix: { type: String, default: defaultPrefix },
  loggingChannel: { type: SchemaTypes.String, default: '' },
  loggingActive: { type: SchemaTypes.Boolean, default: false }
});
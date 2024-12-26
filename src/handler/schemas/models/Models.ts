import mongoose from "mongoose";
import { GuildSchema } from "../GuildsSchema";
import { EconomySchema } from "../EconomySchema";
import { GuildEconomy, GuildData } from "src/handler/types/Database";

export const Server = mongoose.model<GuildData>('Guild', GuildSchema);
export const Economy = mongoose.model<GuildEconomy>("Economy", EconomySchema);
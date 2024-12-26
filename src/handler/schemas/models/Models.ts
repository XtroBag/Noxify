import mongoose from "mongoose";
import { ServerSchema } from "../GuildsSchema";
import { EconomySchema } from "../EconomySchema";
import { GuildEconomy, ServerData } from "src/handler/types/Database";

export const Server = mongoose.model<ServerData>('Guild', ServerSchema);
export const Economy = mongoose.model<GuildEconomy>("Economy", EconomySchema);
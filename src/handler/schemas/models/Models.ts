import mongoose from "mongoose";
import { ServerSchema } from "../GuildsSchema";
import { EconomySchema } from "../EconomySchema";
import { GuildEconomy, ServerData, WeaponData } from "src/handler/types/Database";

export const Server = mongoose.model<ServerData>("Guild", ServerSchema);
export const Economy = mongoose.model<GuildEconomy>("Economy", EconomySchema);
// export const Weapon = mongoose.model<WeaponData>("Weapon", WeaponSchema);
// export const Food = mongoose.model<FoodData>("Food", FoodSchema);
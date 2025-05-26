import mongoose from "mongoose";
import { ServerSchema } from "../Guild.js";
import { ServerData } from "../../Types/Database.js";

export const Server = mongoose.model<ServerData>("Guild", ServerSchema);
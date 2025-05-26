import "dotenv/config";
import { DiscordClient } from "./System/Utils/Functions/Handlers/DiscordClient.js";

export const client = new DiscordClient();

client.start();

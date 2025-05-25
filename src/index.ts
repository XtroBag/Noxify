import 'dotenv/config';
import { DiscordClient } from "./System/Utils/Functions/Handlers/DiscordClient.js";

export const client: DiscordClient = new DiscordClient();

(async (): Promise<void> => {
    await client.registerEvents();
    await client.registerComponents();
    await client.registerCommands();
    await client.registerDatabase();
    client.connect();
})();
import 'dotenv/config';
import { DiscordClient } from "./handler/util/DiscordClient";

export const client: DiscordClient = new DiscordClient();

(async (): Promise<void> => {
    await client.registerEvents();
    await client.registerComponents();
    await client.registerItems();
    await client.registerCommands();
    await client.registerDatabase();
    client.connect();
})();
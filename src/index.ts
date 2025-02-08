import 'dotenv/config';
import { AutomaticIntents } from './handler/types/Intent';
import { DiscordClient } from "./handler/util/DiscordClient";

export const client: DiscordClient = new DiscordClient({
    intents: AutomaticIntents
});

(async (): Promise<void> => {
    await client.registerEvents();
    await client.registerComponents();
    await client.registerItems();
    await client.registerDatabase();
    await client.registerCommands({ deploy: true });
    await client.connect(process.env.CLIENT_TOKEN);
})();
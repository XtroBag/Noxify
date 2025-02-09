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
    await client.registerCommands();
    await client.registerDatabase();
    await client.connect(process.env.CLIENT_TOKEN);
})();
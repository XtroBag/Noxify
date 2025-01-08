import 'dotenv/config';
import { AutomaticIntents } from "./handler";
import { DiscordClient } from "./handler/util/DiscordClient";

export const client: DiscordClient = new DiscordClient({
    intents: AutomaticIntents
});

(async (): Promise<void> => {
    await client.registerEvents();
    await client.registerComponents();
    await client.registerItems();
    await client.registerDatabase({ enabled: true });
    await client.registerCommands({ deploy: true });
    // Existing commands can be deleted like this:
    // await client.deleteCommand("1239882465229668414", RegisterTypes.Guild)
    // await client.deleteCommands(["1239882465229668414", "1239882465229668414"], RegisterTypes.Guild)
    // await client.deleteAllCommands(RegisterTypes.Global)
    await client.connect(process.env.CLIENT_TOKEN);

})();
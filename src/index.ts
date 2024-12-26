import 'dotenv/config';
import { AutomaticIntents } from "./handler";
import { DiscordClient } from "./handler/util/DiscordClient";

export const client: DiscordClient = new DiscordClient({
    // "AutomaticIntents" will provide your client with all necessary Intents.
    // By default, two specific Intents are enabled (Guilds, & MessageContent).
    // For details or modifications, see the config.ts file.
    // Manually adding Intents also works.
    intents: AutomaticIntents
});

(async (): Promise<void> => {
    // You can modify the "events", "components" and "commands" folder name in the config.ts file.
    // All directory's can have subfolders, subfolders in subfolders and even no subfolders.
    await client.registerEvents();
    await client.registerComponents();
    await client.registerDatabase({ enabled: true });
    await client.registerCommands({ deploy: true });
    // Existing commands can be deleted like this:
    // await client.deleteCommand("1239882465229668414", RegisterTypes.Guild)
    // await client.deleteCommands(["1239882465229668414", "1239882465229668414"], RegisterTypes.Guild)
    // await client.deleteAllCommands(RegisterTypes.Guild)
    await client.connect(process.env.CLIENT_TOKEN);

})();
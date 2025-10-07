import { Noxify } from "./handlers/Client";

const client = new Noxify();

client.start(client.env('DISCORD_BOT_TOKEN'))
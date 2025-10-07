"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./handlers/Client");
const client = new Client_1.Noxify();
client.start(client.env('DISCORD_BOT_TOKEN'));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = require("../types/Event");
exports.default = new Event_1.default(discord_js_1.Events.ClientReady, { once: true, enabled: true }, async (noxify, client) => {
    console.log(`Logged in as ${client.user.tag}!`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = require("../types/Event");
exports.default = new Event_1.default(discord_js_1.Events.MessageCreate, { once: false, enabled: true }, async (noxify, message) => {
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = require("../types/Event");
exports.default = new Event_1.default(discord_js_1.Events.MessageCreate, { once: false, enabled: true }, async (noxify, message) => {
    if (message.inGuild()) {
        if (message.channel.isTextBased() && !message.author.bot) {
            console.log(`Message from ${message.author.tag} in #${message.channel.name}: ${message.content}`);
        }
        if (message.content.startsWith('!ping')) {
            await message.reply('Pong!');
        }
    }
});

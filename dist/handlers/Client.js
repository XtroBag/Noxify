"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noxify = void 0;
const discord_js_1 = require("discord.js");
const EventHandler_1 = require("./EventHandler");
const dotenv_1 = require("dotenv");
const CommandHandler_1 = require("./CommandHandler");
const typerinth_1 = require("typerinth");
(0, dotenv_1.config)({ quiet: true });
class Noxify extends discord_js_1.Client {
    commands;
    modrinth;
    constructor() {
        super({
            intents: [
                new discord_js_1.IntentsBitField([
                    discord_js_1.GatewayIntentBits.Guilds,
                    discord_js_1.GatewayIntentBits.GuildMessages,
                    discord_js_1.GatewayIntentBits.MessageContent,
                ]),
            ],
            partials: [discord_js_1.Partials.GuildMember, discord_js_1.Partials.Channel, discord_js_1.Partials.Message],
            allowedMentions: {
                parse: ["everyone"],
                repliedUser: true,
            },
        });
        this.commands = new discord_js_1.Collection();
        this.modrinth = new typerinth_1.Modrinth({
            baseUrl: "https://api.modrinth.com",
            apiVersion: "v2",
            userAgent: "Noxify/1.0.0",
        });
    }
    env(key, defaultValue = "") {
        const value = process.env[key] || defaultValue;
        if (!value) {
            console.log(`Environment variable ${key} is not set`);
        }
        return value;
    }
    async start(token) {
        await (0, EventHandler_1.loadEvents)(this);
        await (0, CommandHandler_1.loadCommands)(this);
        return this.login(token);
    }
}
exports.Noxify = Noxify;

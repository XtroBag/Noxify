"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEvents = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const loadEvents = async (client) => {
    const eventsPath = (0, path_1.join)(__dirname, "../events");
    const eventFiles = (0, fs_1.readdirSync)(eventsPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
    for (const file of eventFiles) {
        const filePath = (0, path_1.join)(eventsPath, file);
        const imported = await Promise.resolve(`${filePath}`).then(s => require(s));
        const event = imported.default;
        if (!event ||
            typeof event.name !== "string" ||
            typeof event.execute !== "function") {
            console.warn(`Skipping Invalid Event File: ${file}`);
            continue;
        }
        if (event.enabled === false) {
            console.log(`Skipping Disabled Event: ${event.name}`);
            continue;
        }
        event.once
            ? client.once(event.name, (...args) => event.execute(client, ...args))
            : client.on(event.name, (...args) => event.execute(client, ...args));
    }
};
exports.loadEvents = loadEvents;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const loadCommands = async (client) => {
    const foldersPath = (0, path_1.join)(__dirname, "../commands");
    const commandFolders = (0, fs_1.readdirSync)(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = (0, path_1.join)(foldersPath, folder);
        const commandFiles = (0, fs_1.readdirSync)(commandsPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
        for (const file of commandFiles) {
            const filePath = (0, path_1.join)(commandsPath, file);
            const imported = await Promise.resolve(`${filePath}`).then(s => require(s));
            const command = imported.default;
            if (!command ||
                typeof command.data?.name !== "string" ||
                typeof command.execute !== "function") {
                console.log(`Skipping File: ${file}`);
                continue;
            }
            if (command.options.enabled === false) {
                console.log(`Skipping Disabled Command: ${command.data.name}`);
                continue;
            }
            client.commands.set(command.data.name, command);
        }
    }
};
exports.loadCommands = loadCommands;

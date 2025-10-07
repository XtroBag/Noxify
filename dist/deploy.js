"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ quiet: true });
const rest = new discord_js_1.REST().setToken(process.env.DISCORD_BOT_TOKEN ?? "");
(async () => {
    const commands = [];
    const foldersPath = (0, path_1.join)(__dirname, "../dist/commands");
    const commandFolders = (0, fs_1.readdirSync)(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = (0, path_1.join)(foldersPath, folder);
        const commandFiles = (0, fs_1.readdirSync)(commandsPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
        for (const file of commandFiles) {
            const filePath = (0, path_1.join)(commandsPath, file);
            const imported = await Promise.resolve(`${filePath}`).then(s => require(s));
            const command = imported.default;
            commands.push(command.data.toJSON());
        }
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            await rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID ?? ""), {
                body: commands,
            });
            console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    }
})();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerType = void 0;
const discord_js_1 = require("discord.js");
const Command_1 = require("../../types/Command");
var PlayerType;
(function (PlayerType) {
    PlayerType["Java"] = "java";
    PlayerType["Bedrock"] = "bedrock";
})(PlayerType || (exports.PlayerType = PlayerType = {}));
function formatPlayerData(player) {
    if (player.edition === PlayerType.Java) {
        return `✅ Found Java player!

**Username:** ${player.username}
**UUID:** ${player.uuid}
**Skin:** [View Skin](<${player.skin}>)
**Cape:** [View Cape](<${player.cape}>)`;
    }
    else {
        return `✅ Found Bedrock player!
    
**Gamertag:** ${player.gamertag}
**XUID:** ${player.xuid}
**Skin:** [View Skin](<${player.skin}>)`;
    }
}
exports.default = new Command_1.default({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("mcuser")
        .setDescription("Search for a Minecraft user by their username")
        .addStringOption((option) => option
        .setName("edition")
        .setDescription("The Minecraft edition")
        .setRequired(true)
        .addChoices({ name: "Java", value: PlayerType.Java }, { name: "Bedrock", value: PlayerType.Bedrock }))
        .addStringOption((option) => option
        .setName("username")
        .setDescription("The Minecraft username")
        .setRequired(true)),
    options: {
        enabled: true,
        developerOnly: false,
    },
    execute: async ({ interaction }) => {
        const edition = interaction.options.getString("edition", true);
        const username = interaction.options.getString("username", true);
        const baseUrl = "https://mcprofile.io/api/v1";
        const endpoint = edition === PlayerType.Java
            ? `/java/username/${username}`
            : `/bedrock/gamertag/${username}`;
        const url = `${baseUrl}${endpoint}`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                await interaction.reply({
                    content: `❌ Failed to fetch data: ${res.status} ${res.statusText}`,
                    flags: discord_js_1.MessageFlags.Ephemeral,
                });
                return;
            }
            const data = await res.json();
            const playerData = edition === PlayerType.Java
                ? { edition: PlayerType.Java, ...data }
                : { edition: PlayerType.Bedrock, ...data };
            const message = formatPlayerData(playerData);
            await interaction.reply({
                content: message,
            });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: "❌ An error occurred while fetching the user data.",
                ephemeral: true,
            });
        }
    },
});

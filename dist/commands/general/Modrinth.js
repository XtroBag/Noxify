"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../types/Command");
exports.default = new Command_1.default(new discord_js_1.SlashCommandBuilder()
    .setName("modrinth")
    .setDescription("search for project on modrinth.")
    .addStringOption((option) => option
    .setName("query")
    .setDescription("The project name or keyword to search for")
    .setRequired(false))
    .setContexts([discord_js_1.InteractionContextType.Guild, discord_js_1.InteractionContextType.PrivateChannel])
    .setIntegrationTypes([discord_js_1.ApplicationIntegrationType.GuildInstall, discord_js_1.ApplicationIntegrationType.UserInstall]), {
    enabled: true,
    developerOnly: false,
}, async (client, interaction) => {
    await interaction.reply({ content: client.env("DISCORD_BOT_CLIENT_ID"), flags: [discord_js_1.MessageFlags.Ephemeral] });
});

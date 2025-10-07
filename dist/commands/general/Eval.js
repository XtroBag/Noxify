"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../types/Command");
exports.default = new Command_1.default(new discord_js_1.SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluates JavaScript code (dev only)")
    .setContexts([
    discord_js_1.InteractionContextType.Guild,
    discord_js_1.InteractionContextType.PrivateChannel,
])
    .setIntegrationTypes([
    discord_js_1.ApplicationIntegrationType.GuildInstall,
    discord_js_1.ApplicationIntegrationType.UserInstall,
])
    .addStringOption((option) => option
    .setName("code")
    .setDescription("The code to evaluate")
    .setRequired(true)), {
    enabled: true,
    developerOnly: true,
}, async (client, interaction) => {
    const code = interaction.options.getString("code", true);
    try {
        const result = await eval(code);
        const resultOutput = result instanceof Promise ? await result : result;
        const output = typeof resultOutput === "string"
            ? resultOutput
            : JSON.stringify(resultOutput, null, 2);
        await interaction.reply({
            content: `\`\`\`js\n${output}\n\`\`\``,
        });
        return;
    }
    catch (error) {
        console.error(`eval: Error occurred while evaluating code: ${error}`);
        await interaction.reply({
            content: `\`\`\`js\n${error}\n\`\`\``,
        });
        return;
    }
});

import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../types/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluates JavaScript code (dev only)")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to evaluate")
        .setRequired(true)
    ),
  options: {
    enabled: true,
    developerOnly: true,
  },
  execute: async ({ client, interaction }) => {
    const code = interaction.options.getString("code", true);

    try {
      const result = await eval(code);
      const resultOutput = result instanceof Promise ? await result : result;
      const output =
        typeof resultOutput === "string"
          ? resultOutput
          : JSON.stringify(resultOutput, null, 2);

      await interaction.reply({
        content: `\`\`\`js\n${output}\n\`\`\``,
      });
      return;
    } catch (error) {
      console.error(`eval: Error occurred while evaluating code: ${error}`);
      await interaction.reply({
        content: `\`\`\`js\n${error}\n\`\`\``,
      });
      return;
    }
  },
});

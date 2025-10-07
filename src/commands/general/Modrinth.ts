import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../types/Command";

export default new Command(
  new SlashCommandBuilder()
    .setName("modrinth")
    .setDescription("search for project on modrinth.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The project name or keyword to search for")
        .setRequired(false)
    )
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ]),
  {
    enabled: true,
    developerOnly: false,
  },
  async (client, interaction) => {}
);

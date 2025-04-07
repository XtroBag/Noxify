import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
  ApplicationIntegrationType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import { BuiltInParserName, format } from "prettier";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("pastes")
    .setDescription("Upload some code to pastes")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("The code language to upload")
        .setRequired(true)
        .setChoices([
          { name: "JavaScript", value: "javascript" },
          { name: "TypeScript", value: "typescript" },
          { name: "HTML", value: "html" },
          { name: "CSS", value: "css" },
          { name: "JSON", value: "json" },
          { name: "YAML", value: "yaml" },
          { name: "Markdown", value: "markdown" },
        ])
    )
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to upload to show users")
        .setRequired(true)
    ),
  async execute({ client, interaction }) {
    const raw = interaction.options.getString("code");
    const language = interaction.options.getString("language");

    let code = raw.trim();

    const prettierParsers: Record<string, string> = {
      javascript: "babel",
      typescript: "typescript",
      json: "json",
      html: "html",
      css: "css",
      markdown: "markdown",
      yaml: "yaml",
    };

    const parser = prettierParsers[language];

    if (parser) {
      try {
        code = await format(code, { parser });
      } catch (err) {
        console.warn("Could not format code with Prettier:", err);
      }
    }

    const link = await client.utils.uploadPaste(code, language);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Success)
          .setDescription(`Here is your link: ${link}`),
      ],
    });
  },
} as SlashCommandModule;

// ─────────────────────────────────────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────────────────────────────────────
import {
  ModrinthFullProject,
  ModrinthSearchResponse,
  ModrinthSideSupport,
  ModrinthTeamMember,
  ModrinthUser,
  ProjectDependenciesResponse,
} from "../../../handler/types/Modrinth";

import { Colors, Emojis } from "../../../config";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";

import {
  ApplicationCommandOptionChoiceData,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  MessageFlags,
  SectionBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";

// ─────────────────────────────────────────────────────────────────────────────
// 🟦 Command Setup
// ─────────────────────────────────────────────────────────────────────────────
export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  data: new SlashCommandBuilder()
    .setName("modrinth")
    .setDescription("Find stuff from Modrinth and show it on Discord")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall
    )
    .addSubcommand((sub) =>
      sub
        .setName("mod")
        .setDescription("Search for a mod on Modrinth")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the Minecraft mod")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("user")
        .setDescription("Search for a user on Modrinth")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the Modrinth user")
            .setRequired(true)
        )
    ),

  // ─────────────────────────────────────────────────────────────────────────
  // ⚙️ Command Execution
  // ─────────────────────────────────────────────────────────────────────────
  async execute({ client, interaction }) {
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "mod") {
      try {
        const slug = interaction.options.getString("name");
        const projectRes = await fetch(
          `https://api.modrinth.com/v2/project/${slug}`
        );

        if (!projectRes.ok) {
         return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Error)
                .setDescription(`${Emojis.Cross} That project doesn't seem to exist. Try using autocomplete.`),
            ],
          });
        }

        const projectData: ModrinthFullProject = await projectRes.json();

        const loaderEmojiMap: Record<string, string> = {
          bukkit: Emojis.Bukkit,
          bungeecord: Emojis.BungeeCord,
          fabric: Emojis.Fabric,
          folia: Emojis.Folia,
          forge: Emojis.Forge,
          liteloader: Emojis.LiteLoader,
          modloader: Emojis.ModLoader,
          neoforge: Emojis.NeoForge,
          quilt: Emojis.Quilt,
          rift: Emojis.Rift,
          paper: Emojis.PaperMC,
          purpur: Emojis.Purpur,
          spigot: Emojis.Spigot,
          sponge: Emojis.Sponge,
          velocity: Emojis.Velocity,
          waterfall: Emojis.Waterfall,
        };

        const loaderEmojiDisplay = projectData.loaders
          .map((loader) => loaderEmojiMap[loader] ?? Emojis.ModrinthOther)
          .join(" | ");

        const sideSupportEmojiMap: Record<ModrinthSideSupport, string> = {
          required: Emojis.Check,
          optional: Emojis.Info,
          unsupported: Emojis.Cross,
          unknown: Emojis.Cross,
        };

        const dependencyRes = await fetch(
          `https://api.modrinth.com/v2/project/${slug}/dependencies`
        );
        const dependencyData: ProjectDependenciesResponse =
          await dependencyRes.json();
        const optionalDependencies = dependencyData.projects.filter(
          (p) => p.title !== "Fabric API"
        );

        const teamRes = await fetch(
          `https://api.modrinth.com/v2/project/${slug}/members`
        );
        const teamMembers: ModrinthTeamMember[] = await teamRes.json();

        const uiContainer = new ContainerBuilder().setAccentColor(
          projectData.color
        );

        uiContainer.addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `# ${projectData.title}\n${projectData.description}`
              )
            )
            .setThumbnailAccessory(
              new ThumbnailBuilder().setURL(projectData.icon_url)
            )
        );

        uiContainer.addSeparatorComponents((sep) =>
          sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );

        uiContainer.addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                [
                  `### Updated: <t:${Math.floor(new Date(projectData.updated).getTime() / 1000)}:R> | Published: <t:${Math.floor(new Date(projectData.published).getTime() / 1000)}:R>`,
                  `- Loaders: ${loaderEmojiDisplay}`,
                  `- Categories: ${projectData.categories
                    .map((c) =>
                      inlineCode(c.charAt(0).toUpperCase() + c.slice(1))
                    )
                    .join(" | ")}`,
                  `${Emojis.ModEnviromentClient} Client Side: ${sideSupportEmojiMap[projectData.client_side]} (${projectData.client_side[0].toUpperCase() + projectData.client_side.slice(1)})`,
                  `${Emojis.ModEnviromentServer} Server Side: ${sideSupportEmojiMap[projectData.server_side]} (${projectData.server_side[0].toUpperCase() + projectData.server_side.slice(1)})`,
                ].join("\n")
              )
            )
            .setButtonAccessory((button) =>
              button
                .setLabel("Link")
                .setStyle(ButtonStyle.Link)
                .setURL(`https://modrinth.com/mod/${projectData.slug}`)
            )
        );

        uiContainer.addActionRowComponents((row) =>
          row.addComponents([
            new StringSelectMenuBuilder()
              .setCustomId("dependency-view")
              .setPlaceholder("View more about a dependency")
              .addOptions(
                optionalDependencies.length > 0
                  ? optionalDependencies.map((p) => ({
                      label: p.title,
                      value: p.id,
                    }))
                  : [{ label: "No Dependencies", value: "none", default: true }]
              )
              .setDisabled(optionalDependencies.length === 0),
          ])
        );

        uiContainer.addSeparatorComponents((sep) =>
          sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );

        const externalLinkButtons = [
          { label: "Source", url: projectData.source_url },
          { label: "Wiki", url: projectData.wiki_url },
          { label: "Discord", url: projectData.discord_url },
          { label: "Issues", url: projectData.issues_url },
        ]
          .filter(({ url }) => !!url)
          .map(({ label, url }) =>
            new ButtonBuilder()
              .setLabel(label)
              .setStyle(ButtonStyle.Link)
              .setURL(url!)
          );

        if (externalLinkButtons.length > 0) {
          uiContainer.addActionRowComponents((row) =>
            row.addComponents(externalLinkButtons)
          );

          uiContainer.addTextDisplayComponents((text) =>
            text.setContent(
              `-# Created By: ${teamMembers.map((member) => member.user.username).join(', ')}`
            )
          );
        }

        await interaction.reply({
          components: [uiContainer],
          flags: MessageFlags.IsComponentsV2,
        });
      } catch (error) {
        console.error("[Modrinth] Error fetching project:", error);
        await interaction.reply({
          content:
            "❌ Failed to fetch the mod from Modrinth. Please try again later.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // ─────────────────────────────────────────────
    // 👤 User Subcommand
    // ─────────────────────────────────────────────
    else if (subcommand === "user") {
      const username = interaction.options.getString("name");
      const userRes = await fetch(
        `https://api.modrinth.com/v2/user/${username}`
      );
      const userData: ModrinthUser = await userRes.json();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(userData.username)
            .setDescription(userData.bio)
            .setThumbnail(userData.avatar_url)
            .setFields([
              {
                name: "Created:",
                value: `<t:${Math.floor(new Date(userData.created).getTime() / 1000)}:R>`,
              },
            ]),
        ],
      });
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ✨ Autocomplete Handler
  // ─────────────────────────────────────────────────────────────────────────
  async autocomplete(interaction, client) {
    const focusedInput = interaction.options.getFocused();
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "mod") {
      try {
        const searchRes = await fetch(
          `https://api.modrinth.com/v2/search?query=${focusedInput}&limit=25&facets=[["project_type:mod"]]`
        );
        if (!searchRes.ok)
          throw new Error(`Failed to search: ${searchRes.statusText}`);

        const searchData: ModrinthSearchResponse = await searchRes.json();
        const searchResults: ApplicationCommandOptionChoiceData[] =
          searchData.hits.map((project) => ({
            name: project.title ?? "Unknown",
            value: project.slug ?? "unknown",
          }));

        await interaction.respond(searchResults);
      } catch (err) {
        console.error("[Modrinth] Autocomplete error:", err);
        await interaction.respond([
          {
            name: "⚠️ Error fetching results",
            value: "error",
          },
        ]);
      }
    }
  },
} as SlashCommandModule;

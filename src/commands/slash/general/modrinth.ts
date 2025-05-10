// ─── Imports ──────────────────────────────────────────────────────────────────────
import {
  ModrinthFullProject,
  ModrinthSearchResponse,
  ModrinthSearchResultProject,
  ModrinthSideSupport,
  ModrinthTeamMember,
  ModrinthUser,
  ProjectDependenciesResponse,
  ProjectDependency,
} from "../../../handler/types/Modrinth"; // → Types: Modrinth API
import { Colors, Emojis } from "../../../config"; // → Config: Emojis and Colors
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command"; // → Command Typing
import {
  ActionRowBuilder,
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
} from "discord.js"; // → Discord.js Components
import user from "../utilities/user"; // → Custom Utility (Unused?)
import sharp from "sharp"; // → Image Processing (Unused?)

// ─── Command Definition ──────────────────────────────────────────────────────────
export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,

  // ─── Slash Command Builder ─────────────────────────────────────────────────────
  data: new SlashCommandBuilder()
    .setName("modrinth")
    .setDescription("find stuff from modrinth and show it on discord")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall
    )
    // ── Subcommand: mod
    .addSubcommand((sub) =>
      sub
        .setName("mod")
        .setDescription("search for a mod on modrinth to show")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("the name of the minecraft mod")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    // ── Subcommand: user
    .addSubcommand((sub) =>
      sub
        .setName("user")
        .setDescription("search for a user on modrinth to show")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("the name of the modrinth user")
            .setRequired(true)
        )
    ),

  // ─── Command Execution ─────────────────────────────────────────────────────────
  async execute({ client, interaction }) {
    const option = interaction.options.getSubcommand(true);

    if (option === "mod") {
      // ── Fetch Mod Project Data ─────────────────────────────────────────────────
      try {
        const slug = interaction.options.getString("name");
        const response = await fetch(
          `https://api.modrinth.com/v2/project/${slug}`
        );

        if (!response.ok)
          throw new Error(`Failed to fetch project: ${response.statusText}`);
        const project: ModrinthFullProject = await response.json();

        // ── Loader Icons + Formatting ────────────────────────────────────────────
        const loaderEmojis: Record<string, string> = {
          forge: "<:Forge_Icon:1370591845981098024>",
          fabric: "<:Fabric_Icon:1370591780357148722>",
          quilt: "<:Quilt_Icon:1370591879447580692>",
          neoforge: "<:NeoForge_Icon:1370591862909436004>",
        };

        const formattedLoaders = project.loaders
          .map((loader) => {
            const formattedLoader =
              loader === "neoforge"
                ? "NeoForge"
                : loader.charAt(0).toUpperCase() + loader.slice(1);

            return `${loaderEmojis[loader] || "❓"} ${inlineCode(formattedLoader)}`;
          })
          .join(" ");

        const supportEmojis: Record<ModrinthSideSupport, string> = {
          required: Emojis.Check,
          optional: Emojis.Info,
          unsupported: Emojis.Cross,
          unknown: Emojis.Cross,
        };

        // ── Fetch Dependencies ───────────────────────────────────────────────────
        const fetchDependencies = await fetch(
          `https://api.modrinth.com/v2/project/${slug}/dependencies`
        );
        const dependencies: ProjectDependenciesResponse =
          await fetchDependencies.json();
        const filteredDependencies = dependencies.projects.filter(
          (project) => project.title !== "Fabric API"
        );

        // ── Fetch Team Members ───────────────────────────────────────────────────
        const fetchTeam = await fetch(
          `https://api.modrinth.com/v2/project/${slug}/members`
        );
        const teamMembers: ModrinthTeamMember[] = await fetchTeam.json();

        // ─── Container UI Layout ─────────────────────────────────────────────────
        const container = new ContainerBuilder()
          .setAccentColor(project.color)

          // ── Section: Basic Info ────────────────────────────────────────────────
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  [
                    `# ${project.title}`,
                    `${project.description}`,
                    `### Updated: <t:${Math.floor(new Date(project.updated).getTime() / 1000)}:R> | Published: <t:${Math.floor(new Date(project.published).getTime() / 1000)}:R>`,
                  ].join("\n")
                )
              )
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(project.icon_url)
              )
          )

          // ── Divider ────────────────────────────────────────────────────────────
          .addSeparatorComponents((builder) =>
            builder.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
          )

          // ── Section: Loaders & Support Info ────────────────────────────────────
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  [
                    `Platforms: ${formattedLoaders}`,
                    `Client Side: ${supportEmojis[project.client_side as ModrinthSideSupport]} (${project.client_side.charAt(0).toUpperCase() + project.client_side.slice(1)})`,
                    `Server Side: ${supportEmojis[project.server_side as ModrinthSideSupport]} (${project.server_side.charAt(0).toUpperCase() + project.server_side.slice(1)})`,
                  ].join("\n")
                )
              )
              .setButtonAccessory((button) =>
                button
                  .setLabel("Link")
                  .setStyle(ButtonStyle.Link)
                  .setURL(`https://modrinth.com/mod/${project.slug}`)
              )
          )

          // ── Select Menu: Dependencies ─────────────────────────────────────────
          .addActionRowComponents((builder) =>
            builder.addComponents([
              new StringSelectMenuBuilder()
                .setCustomId("dependency-view")
                .setPlaceholder("View more about a dependency")
                .addOptions(
                  filteredDependencies.length > 0
                    ? filteredDependencies.map((project) => ({
                        label: project.title,
                        value: project.id,
                      }))
                    : [
                        {
                          label: "No Dependencies",
                          value: "none",
                          default: true,
                        },
                      ]
                ),
            ])
          )

          // ── TODO: Created By (Incomplete line) ────────────────────────────────
          .addTextDisplayComponents((builder) =>
            builder.setContent(
              `-# Created By: ${teamMembers.find((member) => member.role === "developer" || "Unknown").user.username}`
            )
          );

        // ── Send Response ───────────────────────────────────────────────────────
        await interaction.reply({
          components: [container],
          flags: MessageFlags.IsComponentsV2,
        });
      } catch (error) {
        // ── Error Handling ──────────────────────────────────────────────────────
        console.error("[Modrinth] Error fetching project:", error);
        await interaction.reply({
          content:
            "❌ Failed to fetch the mod from Modrinth. Please try again later.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // ─── User Subcommand ────────────────────────────────────────────────────────
    else if (option === "user") {
      const username = interaction.options.getString("name");

      const response = await fetch(
        `https://api.modrinth.com/v2/user/${username}`
      );
      const data: ModrinthUser = await response.json();

      console.log(data);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(data.username)
            .setDescription(data.bio)
            .setThumbnail(data.avatar_url)
            .setFields([
              {
                name: "Created: ",
                value: `<t:${Math.floor(new Date(data.created).getTime() / 1000)}:R>`,
              },
            ]),
        ],
      });
    }
  },

  // ─── Autocomplete Handler ─────────────────────────────────────────────────────
  async autocomplete(interaction, client) {
    const input = interaction.options.getFocused();
    const option = interaction.options.getSubcommand(true);

    if (option === "mod") {
      try {
        const response = await fetch(
          `https://api.modrinth.com/v2/search?query=${input}&limit=25&facets=[["project_type:mod"]]`
        );
        if (!response.ok)
          throw new Error(`Failed to search: ${response.statusText}`);

        const data: ModrinthSearchResponse = await response.json();

        const results: ApplicationCommandOptionChoiceData[] = data.hits.map(
          (project: ModrinthSearchResultProject) => ({
            name: project.title ?? "Unknown",
            value: project.slug ?? "unknown",
          })
        );

        await interaction.respond(results);
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

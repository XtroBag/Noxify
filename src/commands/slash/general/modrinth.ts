import {
  Facet,
  FacetGroup,
  FacetOperation,
  FacetType,
  Modrinth,
  Project,
  SearchFacets,
  SearchIndex,
} from "typerinth";
import {
  CommandTypes,
  RegisterTypes,
  SlashCommandModule,
} from "../../../handler/types/Command";
import {
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
import { Colors, Emojis } from "../../../config";

const modrinth = new Modrinth({ userAgent: "XtroBag/Noxify/1.0.0" });

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
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(
          "Search a Modrinth Mod, Resource Pack, Data Pack, Shader, Mod Pack, and Plugin"
        )
        .addChoices([
          { name: "Mod", value: "mod" },
          { name: "Resourcepack", value: "resourcepack" },
          { name: "Datapack", value: "datapack" },
          { name: "Shader", value: "shader" },
          { name: "Modpack", value: "modpack" },
          { name: "Plugin", value: "plugin" },
        ])
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Pick a specific item for Modrinth to search")
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async execute({ client, interaction }) {
    const item = interaction.options.getString("item");

    try {

      const project = await modrinth.getProject(item);

      const loaderEmojiMap: Record<string, string> = {
        bukkit: Emojis.Bukkit,
        bungeecord: Emojis.BungeeCord,
        canvas: Emojis.Canvas,
        fabric: Emojis.Fabric,
        folia: Emojis.Folia,
        forge: Emojis.Forge,
        iris: Emojis.Iris,
        liteloader: Emojis.LiteLoader,
        modloader: Emojis.ModLoader,
        neoforge: Emojis.NeoForge,
        quilt: Emojis.Quilt,
        rift: Emojis.Rift,
        optifine: Emojis.Optifine,
        paper: Emojis.PaperMC,
        purpur: Emojis.Purpur,
        spigot: Emojis.Spigot,
        sponge: Emojis.Sponge,
        velocity: Emojis.Velocity,
        waterfall: Emojis.Waterfall,
      };

      const supportEmojiMap: Record<string, string> = {
        required: Emojis.Check,
        optional: Emojis.Info,
        unsupported: Emojis.Cross,
        unknown: Emojis.Cross,
      };

      const versions = project.game_versions.sort((a, b) => {
        const aParts = a.split(".").map(Number);
        const bParts = b.split(".").map(Number);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aNum = aParts[i] ?? 0;
          const bNum = bParts[i] ?? 0;
          if (aNum !== bNum) return aNum - bNum;
        }

        return 0;
      });

      const fetchedDependencies: { projects: Project[] } = await fetch(
        modrinth.getApiUrl() + `/project/${project.slug}/dependencies`
      ).then((res) => res.json());

      const dependencies = fetchedDependencies.projects.filter(
        (p) => p.title !== "Fabric API"
      );
      const team = await modrinth.getProjectTeamMembers(project.id);

      const uiContainer = new ContainerBuilder().setAccentColor(project.color);

      uiContainer.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `# ${project.title}\n${project.description}`
            )
          )
          .setThumbnailAccessory(
            new ThumbnailBuilder().setURL(project.icon_url)
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
                `### Updated: <t:${Math.floor(new Date(project.updated).getTime() / 1000)}:R> | Published: <t:${Math.floor(new Date(project.published).getTime() / 1000)}:R>`,
                `- Loaders: ${project.loaders.map((l) => loaderEmojiMap[l] ?? Emojis.ModrinthOther).join(" | ")}`,
                `- Categories: ${project.categories.map((c) => inlineCode(c)).join(" | ")}`,
                `- Versions: ${versions[0]} - ${versions[versions.length - 1]} (${versions.length} versions supported)`,
                `- Client Side: ${supportEmojiMap[project.client_side]} (${project.client_side[0].toUpperCase() + project.client_side.slice(1)})`,
                `- Server Side: ${supportEmojiMap[project.server_side]} (${project.server_side[0].toUpperCase() + project.server_side.slice(1)})`,
              ].join("\n")
            )
          )
          .setButtonAccessory((button) =>
            button
              .setLabel("Link")
              .setStyle(ButtonStyle.Link)
              .setURL(
                `https://modrinth.com/${project.project_type}/${project.slug}`
              )
          )
      );

      if (dependencies.length > 0) {
        uiContainer.addActionRowComponents((row) =>
          row.addComponents([
            new StringSelectMenuBuilder()
              .setCustomId("dependency-view")
              .setPlaceholder("View more about a dependency")
              .addOptions(
                dependencies.length > 25
                  ? dependencies
                      .slice(0, 24)
                      .map((p) => ({
                        label: p.title,
                        value: p.id,
                        emoji: undefined,
                      }))
                      .concat([
                        {
                          label: "Too many dependencies to list...",
                          value: "overflow",
                          emoji: "❌",
                        },
                      ])
                  : dependencies.map((p) => ({
                      label: p.title,
                      value: p.id,
                    }))
              ),
          ])
        );
      }

      uiContainer.addSeparatorComponents((sep) =>
        sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
      );

      const externalLinkButtons = [
        { label: "Source", url: project.source_url },
        { label: "Wiki", url: project.wiki_url },
        { label: "Discord", url: project.discord_url },
        { label: "Issues", url: project.issues_url },
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

        if (team.length > 0) {
          uiContainer.addTextDisplayComponents((text) =>
            text.setContent(
              `-# By: ${team
                .map((member) => `**[${member.role}]** ${member.user.username}`)
                .join(" | ")}`
            )
          );
        }
      }

      return await interaction.reply({
        components: [uiContainer],
        flags: [MessageFlags.IsComponentsV2],
      });
    } catch (err) {
      console.error("[Modrinth] Error:", err);

      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(`${Emojis.Cross} No project found for **${item}**`),
        ],
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
  async autocomplete(interaction, client) {
    const item = interaction.options.getString("item");
    const type = interaction.options.getString("type");

    const search = await modrinth.search(item, {
      limit: 25,
      index: SearchIndex.Downloads,
      facets: new SearchFacets(
        new FacetGroup(
          new Facet(FacetType.ProjectType, FacetOperation.Equals, type)
        )
      ),
    });

    await interaction.respond(
      search.hits.map((mod) => ({ name: mod.title, value: mod.slug }))
    );
  },
} as SlashCommandModule;

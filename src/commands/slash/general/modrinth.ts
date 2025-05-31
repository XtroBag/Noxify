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
} from "../../../System/Types/Command.js";
import {
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  EmbedBuilder,
  inlineCode,
  InteractionContextType,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";
import { Colors, Emojis } from "../../../config.js";
import Logger from "../../../System/Utils/Functions/Handlers/Logger.js";

const modrinth = new Modrinth({ userAgent: "XtroBag/Noxify/1.0.0" });

export default {
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
          `Search Modrinth for projects. "Mod" also searches Plugins & Datapacks.`
        )
        .addChoices([
          { name: "Mod", value: "mod" },
          { name: "Resourcepack", value: "resourcepack" },
          { name: "Shader", value: "shader" },
          { name: "Modpack", value: "modpack" },
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
    const project_id = interaction.options.getString("item");
    const type = interaction.options.getString("type");

    await interaction.deferReply();

    try {
      const project = await modrinth.getProject(project_id);

      if (project.project_type !== type) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Warning)
              .setDescription(
                `${Emojis.Info} Your input matched a **${project.project_type}**, not a ${type}.`
              ),
          ],
        });
      }

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

      const isClientOrServerSide: Record<string, string> = {
        required: Emojis.RequiredType,
        optional: Emojis.OptionalType,
        unsupported: Emojis.UnsupportedType,
        unknown: Emojis.UnknownType,
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
            new ThumbnailBuilder().setURL(
              project.icon_url || "attachment://Unknown.png"
            )
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
                `${Emojis.Loaders} - ${project.loaders.map((l) => loaderEmojiMap[l] ?? Emojis.ModrinthOther).join(" | ")}`,
                `${Emojis.Categories} - ${project.categories.map((c) => inlineCode(c)).join(" | ")}`,
                `${Emojis.ServerSide} - ${isClientOrServerSide[project.server_side]}`,
                `${Emojis.ClientSide} - ${isClientOrServerSide[project.client_side]}`,
                `${Emojis.Versions} - ${versions[0]} - ${versions[versions.length - 1]}`,
                `${Emojis.Downloads} - ${project.downloads.toLocaleString()}`,
                `${Emojis.Creators} - ${team.length > 0 ? `${team.map((m) => `**[${m.role}]** ${m.user.username}`).join(" | ")}` : "Unknown"}`,
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
      } else if (project.gallery.length > 0) {
        uiContainer.addMediaGalleryComponents(
          new MediaGalleryBuilder().addItems(
            project.gallery
              .slice(0, 10)
              .map((picture) =>
                new MediaGalleryItemBuilder().setURL(picture.url)
              )
          )
        );
      }

      return await interaction.editReply({
        components: [uiContainer],
        flags: [MessageFlags.IsComponentsV2],
        files: [client.utils.getImage("Unknown.png")],
      });
    } catch (err) {
      Logger.error("Project Failure:", err);

      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription(
              `${Emojis.Cross} Couldn't find that search — try using autocomplete.`
            ),
        ],
      });
    }
  },
  async autocomplete(interaction, client) {
    const type = interaction.options.getString("type");
    const item = interaction.options.getFocused(true);

    let facetGroup: FacetGroup;

    if (type === "mod") {
      facetGroup = new FacetGroup(
        new Facet(FacetType.ProjectType, FacetOperation.Equals, "mod"),
        new Facet(FacetType.ProjectType, FacetOperation.Equals, "plugin"),
        new Facet(FacetType.ProjectType, FacetOperation.Equals, "datapack")
      );
    } else {
      facetGroup = new FacetGroup(
        new Facet(FacetType.ProjectType, FacetOperation.Equals, type)
      );
    }

    const search = await modrinth.search(item.value, {
      limit: 25,
      index: SearchIndex.Relevance,
      facets: new SearchFacets(facetGroup),
    });

    const filtered = search.hits.filter((mod) =>
      mod.title.toLowerCase().startsWith(item.value.toLowerCase())
    );

    const choices = filtered.slice(0, 25).map((mod) => ({
      name: mod.title,
      value: mod.project_id,
    }));

    if (choices.length === 0) {
      choices.push({
        name: "No results found. Try a different search term.",
        value: "no_results",
      });
    }

    await interaction.respond(choices);
  },
} as SlashCommandModule;

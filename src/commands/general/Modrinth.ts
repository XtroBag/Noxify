import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  ContainerBuilder,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  SectionBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";
import Command from "../../types/Command";
import { Project, SearchIndex } from "typerinth";
import { CategoryEmojis, Emojis } from "../../types/Emojis";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("modrinth")
    .setDescription("search for project on modrinth.")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("The project name or keyword to search for")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ]),

  options: {
    developerOnly: false,
    enabled: true,
  },
  execute: async ({ client, interaction }) => {
    const name = interaction.options.getString("search", true);

    try {
      const project = await client.modrinth.getProject(name);

      const loaderMap: Record<string, string> = {
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
        "bta-babric": Emojis.BTABabric,
        babric: Emojis.Babric,
        datapack: Emojis.DataPack,
        minecraft: Emojis.Minecraft,
        "legacy-fabric": Emojis.LegacyFabric,
        "java-agent": Emojis.JavaAgent,
        nilloader: Emojis.NilLoader,
        ornithe: Emojis.Ornithe,
      };

      const categoryEmojis = {
        adventure: CategoryEmojis.Adventure,
        atmosphere: CategoryEmojis.Atmosphere,
        audio: CategoryEmojis.Audio,
        blocks: CategoryEmojis.Blocks,
        bloom: CategoryEmojis.Bloom,
        cartoon: CategoryEmojis.Cartoon,
        challenging: CategoryEmojis.Challenging,
        "colored-lighting": CategoryEmojis.ColoredLighting,
        combat: CategoryEmojis.Combat,
        "core-shaders": CategoryEmojis.CoreShaders,
        cursed: CategoryEmojis.Cursed,
        decoration: CategoryEmojis.Decoration,
        economy: CategoryEmojis.Economy,
        entities: CategoryEmojis.Entities,
        environment: CategoryEmojis.Environment,
        equipment: CategoryEmojis.Equipment2,
        fantasy: CategoryEmojis.Fantasy,
        foliage: CategoryEmojis.Foliage,
        fonts: CategoryEmojis.Fonts,
        food: CategoryEmojis.Food,
        "game-mechanics": CategoryEmojis.GameMechanics,
        gui: CategoryEmojis.Gui,
        high: CategoryEmojis.High,
        items: CategoryEmojis.Items,
        "kitchen-sink": CategoryEmojis.KitchenSink,
        library: CategoryEmojis.Library,
        lightweight: CategoryEmojis.Lightweight,
        locale: CategoryEmojis.Locale,
        low: CategoryEmojis.Low,
        magic: CategoryEmojis.Magic,
        management: CategoryEmojis.Management,
        medium: CategoryEmojis.Medium,
        minigame: CategoryEmojis.Minigame,
        mobs: CategoryEmojis.Mobs,
        modded: CategoryEmojis.Modded,
        models: CategoryEmojis.Models,
        multiplayer: CategoryEmojis.Multiplayer,
        optimization: CategoryEmojis.Optimization,
        "path-tracing": CategoryEmojis.PathTracing,
        pbr: CategoryEmojis.Pbr,
        potato: CategoryEmojis.Potato,
        quests: CategoryEmojis.Quests,
        realistic: CategoryEmojis.Realistic,
        reflections: CategoryEmojis.Reflections,
        screenshot: CategoryEmojis.Screenshot,
        "semi-realistic": CategoryEmojis.Semirealistic,
        shadows: CategoryEmojis.Shadows,
        simplified: CategoryEmojis.Simplified,
        social: CategoryEmojis.Social,
        storage: CategoryEmojis.Storage,
        technology: CategoryEmojis.Technology,
        themed: CategoryEmojis.Themed,
        transportation: CategoryEmojis.Transportation,
        tweaks: CategoryEmojis.Tweaks,
        utility: CategoryEmojis.Utility,
        "vanilla-like": CategoryEmojis.Vanillalike,
        wordgen: CategoryEmojis.WorldGeneration,
      };

      async function getProjectMembers(projectSlug, client) {
        try {
          const users = (
            await client.modrinth.getProjectTeamMembers(projectSlug)
          ).map((m) => m.user?.username ?? "Unknown");

          if (!users.length)
            return "**Project Team Members:**\nNo members found.";

          const max = 5;
          const shown = users.slice(0, max);
          const remaining = users.length - max;

          let formatted;
          if (remaining > 0) {
            formatted = shown.join(", ") + ", and more";
          } else if (shown.length === 1) {
            formatted = shown[0];
          } else {
            formatted =
              shown.slice(0, -1).join(", ") +
              ", and " +
              shown[shown.length - 1];
          }

          const label =
            users.length === 1 ? "Project Team Member" : "Project Team Members";

          return `**${label}:**\n${formatted}`;
        } catch {
          return "**Project Team Members:**\nUnable to fetch members.";
        }
      }

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

      const isClientOrServerSide: Record<string, string> = {
        required: Emojis.RequiredType,
        optional: Emojis.OptionalType,
        unsupported: Emojis.UnsupportedType,
        unknown: Emojis.UnknownType,
      };

      const dependencies = await fetch(
        `https://api.modrinth.com/v2/project/${project.slug}/dependencies`
      ).then((res) => res.json());

      const filteredDependencies: Project[] = dependencies.projects.filter(
        (p: Project) => p.title !== "Fabric API"
      );

      const buttons = [
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

      const container = new ContainerBuilder().setAccentColor(project.color);

      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `## ${project.title}\n\n${project.description}\n\n${await getProjectMembers(
                project.slug,
                client
              )}`
            )
          )
          .setThumbnailAccessory(
            new ThumbnailBuilder().setURL(project.icon_url)
          )
      );

      container.addSeparatorComponents((sep) =>
        sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
      );

      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              [
                `${Emojis.ClientSide} ${
                  isClientOrServerSide[project.client_side]
                }`,
                `${Emojis.ServerSide} ${
                  isClientOrServerSide[project.server_side]
                }`,
                `${Emojis.Loaders} ${project.loaders
                  .map((l) => loaderMap[l] ?? Emojis.Minecraft)
                  .join(" | ")}`,
                `${Emojis.Categories} ${project.categories
                  .map((c) => categoryEmojis[c])
                  .join(" | ")}`,
                `${Emojis.Downloads} ${project.downloads.toLocaleString()}`,
                `${Emojis.Versions} ${versions[0]} - ${
                  versions[versions.length - 1]
                }`,
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

      container.addSeparatorComponents((sep) =>
        sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
      );

      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Clicking "Versions" will take you to the Modrinth website, where you can browse all available mod versions and pick the one you need.`
            )
          )
          .setButtonAccessory((button) =>
            button
              .setURL(
                `https://modrinth.com/${project.project_type}/${project.slug}/versions`
              )
              .setLabel("Versions")
              .setStyle(ButtonStyle.Link)
          )
      );

      const maxOptions = 24;

      if (
        filteredDependencies.length > 0 &&
        project.project_type !== "modpack"
      ) {
        const dependencyOptions =
          filteredDependencies.length > maxOptions
            ? [
                ...filteredDependencies.slice(0, maxOptions).map((p) => ({
                  label: p.title,
                  value: p.id,
                })),
                {
                  label: "Too many dependencies to list...",
                  value: "overflow",
                  emoji: "❌",
                },
              ]
            : filteredDependencies.map((p) => ({
                label: p.title,
                value: p.id,
              }));

        container.addActionRowComponents(
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("dependency-view")
              .setPlaceholder("View more about a dependency")
              .addOptions(dependencyOptions)
          )
        );
      }

      container.addSeparatorComponents((sep) =>
        sep.setDivider(false).setSpacing(SeparatorSpacingSize.Small)
      );

      if (buttons.length > 0) {
        container.addActionRowComponents((row) => row.addComponents(buttons));
      }

       container.addSeparatorComponents((sep) =>
        sep.setDivider(false).setSpacing(SeparatorSpacingSize.Small)
      );

      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `-# Updated: <t:${Math.floor(
                new Date(project.updated).getTime() / 1000
              )}:R> ┃ Published <t:${Math.floor(
                new Date(project.published).getTime() / 1000
              )}:R>`
        )
      );

      const reply = await interaction.reply({
        components: [container],
        flags: [MessageFlags.IsComponentsV2],
      });

      const collector = reply.createMessageComponentCollector({
        time: 300000,
      });

      collector.on("collect", async (interaction) => {
        switch (interaction.componentType) {
          case ComponentType.StringSelect:
            if (interaction.customId === "dependency-view") {
              await interaction.deferUpdate();
            }
            break;

          default:
            break;
        }
      });
    } catch (err) {
      if (err)
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(err instanceof Error ? err.message : String(err))
              .setColor(Colors.DarkRed),
          ],
        });
    }
  },
  autocomplete: async ({ client, interaction }) => {
    const input = interaction.options.getFocused(false);

    const searchResults = await client.modrinth.search(input, {
      index: SearchIndex.Relevance,
      limit: 25,
    });

    const choices = searchResults.hits.map((hit) => ({
      name: hit.title,
      value: hit.slug,
    }));

    await interaction.respond(
      choices.length ? choices : [{ name: "No results found", value: "none" }]
    );
  },
});

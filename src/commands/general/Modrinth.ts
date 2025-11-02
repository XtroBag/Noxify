import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContainerBuilder,
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
import { Emojis } from "../../types/Emojis";

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

          return `**Project Team Members:**\n${formatted}`;
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
              `# ${project.title}\n\n${
                project.description
              }\n### Published <t:${Math.floor(
                new Date(project.published).getTime() / 1000
              )}:R> ┃ Updated <t:${Math.floor(
                new Date(project.updated).getTime() / 1000
              )}:R>`
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
                `${Emojis.Loaders} ${project.loaders
                  .map((l) => loaderMap[l] ?? Emojis.ModrinthOther)
                  .join(" | ")}`,
                `${Emojis.Versions} ${versions[0]} - ${
                  versions[versions.length - 1]
                }`,
                `${Emojis.ServerSide} ${
                  isClientOrServerSide[project.server_side]
                }`,
                `${Emojis.ClientSide} ${
                  isClientOrServerSide[project.client_side]
                }`,
                `${Emojis.Downloads} ${project.downloads.toLocaleString()}`,
              ].join("\n") +
                "\n\n" +
                (await getProjectMembers(project.slug, client))
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

      if (buttons.length > 0) {
        container.addActionRowComponents((row) => row.addComponents(buttons));

        container.addSeparatorComponents((sep) =>
          sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );
      }

      const maxOptions = 24;

      // Only show dependencies if there are any AND the project is NOT a modpack
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

      const reply = await interaction.reply({
        components: [container],
        flags: [MessageFlags.IsComponentsV2],
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        // filter: (collected) => collected.user.id !== interaction.user.id,
        time: 60000,
      });


      collector.on("collect", async (interaction) => {
        if (interaction.isStringSelectMenu()) {
          if (interaction.customId === "dependency-view") {
            await interaction.deferUpdate();
          }
        }
      });

      collector.on("ignore", async (interaction) => {
        await interaction.followUp({
          content: `You are not the one who called this menu.`,
        });
      });
      
    } catch (err) {
      await interaction.reply({
        content:
          `Project not found. Please use the autocomplete list to choose a valid project.\n\nDetailed Error: ${err}`,
      });
    }
  },
  autocomplete: async ({ client, interaction }) => {
    const input = interaction.options.getFocused(false);

    if (!input || input.trim().length === 0) {
      return interaction.respond([
        { name: "Please enter a search term", value: "none" },
      ]);
    }

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

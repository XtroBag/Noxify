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

      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Clicking the button opens a prompt to help you find the right mod file version through a few quick questions.`
            )
          )
          .setButtonAccessory((button) =>
            button
              .setCustomId("versions-view")
              .setLabel("Versions")
              .setStyle(ButtonStyle.Primary)
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

      const reply = await interaction.reply({
        components: [container],
        flags: [MessageFlags.IsComponentsV2],
      });

      const collector = reply.createMessageComponentCollector({
        // filter: (collected) => collected.user.id !== interaction.user.id,
        time: 300000,
      });

      collector.on("collect", async (interaction) => {
        switch (interaction.componentType) {
          case ComponentType.StringSelect:
            if (interaction.customId === "dependency-view") {
              await interaction.deferUpdate();
            }
            break;

          case ComponentType.Button:
            if (interaction.customId === "versions-view") {
              const versions = await client.modrinth.getProjectVersions(
                project.slug,
                {
                  loaders: project.loaders,
                  game_versions: project.game_versions,
                  featured: false,
                }
              );

              const versionList = versions
                .slice(0, 5) // Limit to first 5 versions
                .map((v) => {
                  const date = new Date(v.date_published).toLocaleDateString();
                  const downloads = v.downloads?.toLocaleString() || "0";

                  const filesList = v.files
                    .map(
                      (file) =>
                        `> [${file.filename}](${file.url})${
                          file.primary ? " (primary)" : ""
                        }`
                    )
                    .join("\n");

                  return [
                    `**${v.name || v.game_versions[0]}**`,
                    `> 📅 **Published:** ${date}`,
                    `> ⬇️ **Downloads:** ${downloads}`,
                    `> 📁 **Files:**\n${filesList}`,
                  ].join("\n");
                })
                .join("\n\n");

              await interaction.deferReply();

              await interaction.followUp({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`Version Selection for ${project.title}`)
                    .setDescription(versionList)
                    .setColor(Colors.Blue),
                ],
                flags: MessageFlags.Ephemeral,
              });
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
              .setDescription(`**Error:** ${err}`)
              .setColor(Colors.DarkRed),
          ],
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

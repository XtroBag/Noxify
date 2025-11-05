"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../types/Command");
const typerinth_1 = require("typerinth");
const Emojis_1 = require("../../types/Emojis");
exports.default = new Command_1.default({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("modrinth")
        .setDescription("search for project on modrinth.")
        .addStringOption((option) => option
        .setName("search")
        .setDescription("The project name or keyword to search for")
        .setRequired(true)
        .setAutocomplete(true))
        .setContexts([
        discord_js_1.InteractionContextType.Guild,
        discord_js_1.InteractionContextType.PrivateChannel,
    ])
        .setIntegrationTypes([
        discord_js_1.ApplicationIntegrationType.GuildInstall,
        discord_js_1.ApplicationIntegrationType.UserInstall,
    ]),
    options: {
        developerOnly: false,
        enabled: true,
    },
    execute: async ({ client, interaction }) => {
        const name = interaction.options.getString("search", true);
        try {
            const project = await client.modrinth.getProject(name);
            const loaderMap = {
                bukkit: Emojis_1.Emojis.Bukkit,
                bungeecord: Emojis_1.Emojis.BungeeCord,
                canvas: Emojis_1.Emojis.Canvas,
                fabric: Emojis_1.Emojis.Fabric,
                folia: Emojis_1.Emojis.Folia,
                forge: Emojis_1.Emojis.Forge,
                iris: Emojis_1.Emojis.Iris,
                liteloader: Emojis_1.Emojis.LiteLoader,
                modloader: Emojis_1.Emojis.ModLoader,
                neoforge: Emojis_1.Emojis.NeoForge,
                quilt: Emojis_1.Emojis.Quilt,
                rift: Emojis_1.Emojis.Rift,
                optifine: Emojis_1.Emojis.Optifine,
                paper: Emojis_1.Emojis.PaperMC,
                purpur: Emojis_1.Emojis.Purpur,
                spigot: Emojis_1.Emojis.Spigot,
                sponge: Emojis_1.Emojis.Sponge,
                velocity: Emojis_1.Emojis.Velocity,
                waterfall: Emojis_1.Emojis.Waterfall,
                "bta-babric": Emojis_1.Emojis.BTABabric,
                babric: Emojis_1.Emojis.Babric,
                datapack: Emojis_1.Emojis.DataPack,
                minecraft: Emojis_1.Emojis.Minecraft,
                "legacy-fabric": Emojis_1.Emojis.LegacyFabric,
                "java-agent": Emojis_1.Emojis.JavaAgent,
                nilloader: Emojis_1.Emojis.NilLoader,
                ornithe: Emojis_1.Emojis.Ornithe,
            };
            const categoryEmojis = {
                adventure: Emojis_1.CategoryEmojis.Adventure,
                atmosphere: Emojis_1.CategoryEmojis.Atmosphere,
                audio: Emojis_1.CategoryEmojis.Audio,
                blocks: Emojis_1.CategoryEmojis.Blocks,
                bloom: Emojis_1.CategoryEmojis.Bloom,
                cartoon: Emojis_1.CategoryEmojis.Cartoon,
                challenging: Emojis_1.CategoryEmojis.Challenging,
                "colored-lighting": Emojis_1.CategoryEmojis.ColoredLighting,
                combat: Emojis_1.CategoryEmojis.Combat,
                "core-shaders": Emojis_1.CategoryEmojis.CoreShaders,
                cursed: Emojis_1.CategoryEmojis.Cursed,
                decoration: Emojis_1.CategoryEmojis.Decoration,
                economy: Emojis_1.CategoryEmojis.Economy,
                entities: Emojis_1.CategoryEmojis.Entities,
                environment: Emojis_1.CategoryEmojis.Environment,
                equipment: Emojis_1.CategoryEmojis.Equipment2,
                fantasy: Emojis_1.CategoryEmojis.Fantasy,
                foliage: Emojis_1.CategoryEmojis.Foliage,
                fonts: Emojis_1.CategoryEmojis.Fonts,
                food: Emojis_1.CategoryEmojis.Food,
                "game-mechanics": Emojis_1.CategoryEmojis.GameMechanics,
                gui: Emojis_1.CategoryEmojis.Gui,
                high: Emojis_1.CategoryEmojis.High,
                items: Emojis_1.CategoryEmojis.Items,
                "kitchen-sink": Emojis_1.CategoryEmojis.KitchenSink,
                library: Emojis_1.CategoryEmojis.Library,
                lightweight: Emojis_1.CategoryEmojis.Lightweight,
                locale: Emojis_1.CategoryEmojis.Locale,
                low: Emojis_1.CategoryEmojis.Low,
                magic: Emojis_1.CategoryEmojis.Magic,
                management: Emojis_1.CategoryEmojis.Management,
                medium: Emojis_1.CategoryEmojis.Medium,
                minigame: Emojis_1.CategoryEmojis.Minigame,
                mobs: Emojis_1.CategoryEmojis.Mobs,
                modded: Emojis_1.CategoryEmojis.Modded,
                models: Emojis_1.CategoryEmojis.Models,
                multiplayer: Emojis_1.CategoryEmojis.Multiplayer,
                optimization: Emojis_1.CategoryEmojis.Optimization,
                "path-tracing": Emojis_1.CategoryEmojis.PathTracing,
                pbr: Emojis_1.CategoryEmojis.Pbr,
                potato: Emojis_1.CategoryEmojis.Potato,
                quests: Emojis_1.CategoryEmojis.Quests,
                realistic: Emojis_1.CategoryEmojis.Realistic,
                reflections: Emojis_1.CategoryEmojis.Reflections,
                screenshot: Emojis_1.CategoryEmojis.Screenshot,
                "semi-realistic": Emojis_1.CategoryEmojis.Semirealistic,
                shadows: Emojis_1.CategoryEmojis.Shadows,
                simplified: Emojis_1.CategoryEmojis.Simplified,
                social: Emojis_1.CategoryEmojis.Social,
                storage: Emojis_1.CategoryEmojis.Storage,
                technology: Emojis_1.CategoryEmojis.Technology,
                themed: Emojis_1.CategoryEmojis.Themed,
                transportation: Emojis_1.CategoryEmojis.Transportation,
                tweaks: Emojis_1.CategoryEmojis.Tweaks,
                utility: Emojis_1.CategoryEmojis.Utility,
                "vanilla-like": Emojis_1.CategoryEmojis.Vanillalike,
                wordgen: Emojis_1.CategoryEmojis.WorldGeneration,
            };
            async function getProjectMembers(projectSlug, client) {
                try {
                    const users = (await client.modrinth.getProjectTeamMembers(projectSlug)).map((m) => m.user?.username ?? "Unknown");
                    if (!users.length)
                        return "**Project Team Members:**\nNo members found.";
                    const max = 5;
                    const shown = users.slice(0, max);
                    const remaining = users.length - max;
                    let formatted;
                    if (remaining > 0) {
                        formatted = shown.join(", ") + ", and more";
                    }
                    else if (shown.length === 1) {
                        formatted = shown[0];
                    }
                    else {
                        formatted =
                            shown.slice(0, -1).join(", ") +
                                ", and " +
                                shown[shown.length - 1];
                    }
                    const label = users.length === 1 ? "Project Team Member" : "Project Team Members";
                    return `**${label}:**\n${formatted}`;
                }
                catch {
                    return "**Project Team Members:**\nUnable to fetch members.";
                }
            }
            const versions = project.game_versions.sort((a, b) => {
                const aParts = a.split(".").map(Number);
                const bParts = b.split(".").map(Number);
                for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    const aNum = aParts[i] ?? 0;
                    const bNum = bParts[i] ?? 0;
                    if (aNum !== bNum)
                        return aNum - bNum;
                }
                return 0;
            });
            const isClientOrServerSide = {
                required: Emojis_1.Emojis.RequiredType,
                optional: Emojis_1.Emojis.OptionalType,
                unsupported: Emojis_1.Emojis.UnsupportedType,
                unknown: Emojis_1.Emojis.UnknownType,
            };
            const dependencies = await fetch(`https://api.modrinth.com/v2/project/${project.slug}/dependencies`).then((res) => res.json());
            const filteredDependencies = dependencies.projects.filter((p) => p.title !== "Fabric API");
            const buttons = [
                { label: "Source", url: project.source_url },
                { label: "Wiki", url: project.wiki_url },
                { label: "Discord", url: project.discord_url },
                { label: "Issues", url: project.issues_url },
            ]
                .filter(({ url }) => !!url)
                .map(({ label, url }) => new discord_js_1.ButtonBuilder()
                .setLabel(label)
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(url));
            const container = new discord_js_1.ContainerBuilder().setAccentColor(project.color);
            container.addSectionComponents(new discord_js_1.SectionBuilder()
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`## ${project.title}\n\n${project.description}\n\n${await getProjectMembers(project.slug, client)}`))
                .setThumbnailAccessory(new discord_js_1.ThumbnailBuilder().setURL(project.icon_url)));
            container.addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            container.addSectionComponents(new discord_js_1.SectionBuilder()
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent([
                `${Emojis_1.Emojis.ClientSide} ${isClientOrServerSide[project.client_side]}`,
                `${Emojis_1.Emojis.ServerSide} ${isClientOrServerSide[project.server_side]}`,
                `${Emojis_1.Emojis.Loaders} ${project.loaders
                    .map((l) => loaderMap[l] ?? Emojis_1.Emojis.Minecraft)
                    .join(" | ")}`,
                `${Emojis_1.Emojis.Categories} ${project.categories
                    .map((c) => categoryEmojis[c])
                    .join(" | ")}`,
                `${Emojis_1.Emojis.Downloads} ${project.downloads.toLocaleString()}`,
                `${Emojis_1.Emojis.Versions} ${versions[0]} - ${versions[versions.length - 1]}`,
            ].join("\n")))
                .setButtonAccessory((button) => button
                .setLabel("Link")
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(`https://modrinth.com/${project.project_type}/${project.slug}`)));
            container.addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            container.addSectionComponents(new discord_js_1.SectionBuilder()
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`Clicking "Versions" will take you to the Modrinth website, where you can browse all available mod versions and pick the one you need.`))
                .setButtonAccessory((button) => button
                .setURL(`https://modrinth.com/${project.project_type}/${project.slug}/versions`)
                .setLabel("Versions")
                .setStyle(discord_js_1.ButtonStyle.Link)));
            const maxOptions = 24;
            if (filteredDependencies.length > 0 &&
                project.project_type !== "modpack") {
                const dependencyOptions = filteredDependencies.length > maxOptions
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
                container.addActionRowComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("dependency-view")
                    .setPlaceholder("View more about a dependency")
                    .addOptions(dependencyOptions)));
            }
            container.addSeparatorComponents((sep) => sep.setDivider(false).setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            if (buttons.length > 0) {
                container.addActionRowComponents((row) => row.addComponents(buttons));
            }
            container.addSeparatorComponents((sep) => sep.setDivider(false).setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            container.addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`-# Updated: <t:${Math.floor(new Date(project.updated).getTime() / 1000)}:R> ┃ Published <t:${Math.floor(new Date(project.published).getTime() / 1000)}:R>`));
            const reply = await interaction.reply({
                components: [container],
                flags: [discord_js_1.MessageFlags.IsComponentsV2],
            });
            const collector = reply.createMessageComponentCollector({
                time: 300000,
            });
            collector.on("collect", async (interaction) => {
                switch (interaction.componentType) {
                    case discord_js_1.ComponentType.StringSelect:
                        if (interaction.customId === "dependency-view") {
                            await interaction.deferUpdate();
                        }
                        break;
                    default:
                        break;
                }
            });
        }
        catch (err) {
            if (err)
                await interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setDescription(err instanceof Error ? err.message : String(err))
                            .setColor(discord_js_1.Colors.DarkRed),
                    ],
                });
        }
    },
    autocomplete: async ({ client, interaction }) => {
        const input = interaction.options.getFocused(false);
        const searchResults = await client.modrinth.search(input, {
            index: typerinth_1.SearchIndex.Relevance,
            limit: 25,
        });
        const choices = searchResults.hits.map((hit) => ({
            name: hit.title,
            value: hit.slug,
        }));
        await interaction.respond(choices.length ? choices : [{ name: "No results found", value: "none" }]);
    },
});

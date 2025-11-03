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
                    return `**Project Team Members:**\n${formatted}`;
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
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`# ${project.title}\n\n${project.description}\n### Published <t:${Math.floor(new Date(project.published).getTime() / 1000)}:R> ┃ Updated <t:${Math.floor(new Date(project.updated).getTime() / 1000)}:R>`))
                .setThumbnailAccessory(new discord_js_1.ThumbnailBuilder().setURL(project.icon_url)));
            container.addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            container.addSectionComponents(new discord_js_1.SectionBuilder()
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent([
                `${Emojis_1.Emojis.Loaders} ${project.loaders
                    .map((l) => loaderMap[l] ?? Emojis_1.Emojis.ModrinthOther)
                    .join(" | ")}`,
                `${Emojis_1.Emojis.Versions} ${versions[0]} - ${versions[versions.length - 1]}`,
                `${Emojis_1.Emojis.ServerSide} ${isClientOrServerSide[project.server_side]}`,
                `${Emojis_1.Emojis.ClientSide} ${isClientOrServerSide[project.client_side]}`,
                `${Emojis_1.Emojis.Downloads} ${project.downloads.toLocaleString()}`,
            ].join("\n") +
                "\n\n" +
                (await getProjectMembers(project.slug, client))))
                .setButtonAccessory((button) => button
                .setLabel("Link")
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(`https://modrinth.com/${project.project_type}/${project.slug}`)));
            container.addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            container.addSectionComponents(new discord_js_1.SectionBuilder()
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`Clicking the button opens a prompt to help you find the right mod file version through a few quick questions.`))
                .setButtonAccessory((button) => button
                .setCustomId("versions-view")
                .setLabel("Versions")
                .setStyle(discord_js_1.ButtonStyle.Primary)));
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
                    case discord_js_1.ComponentType.Button:
                        if (interaction.customId === "versions-view") {
                            const versions = await client.modrinth.getProjectVersions(project.slug, {
                                loaders: project.loaders,
                                game_versions: project.game_versions,
                                featured: false,
                            });
                            const versionList = versions
                                .slice(0, 5)
                                .map((v) => {
                                const date = new Date(v.date_published).toLocaleDateString();
                                const downloads = v.downloads?.toLocaleString() || "0";
                                const filesList = v.files
                                    .map((file) => `> [${file.filename}](${file.url})${file.primary ? " (primary)" : ""}`)
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
                                    new discord_js_1.EmbedBuilder()
                                        .setTitle(`Version Selection for ${project.title}`)
                                        .setDescription(versionList)
                                        .setColor(discord_js_1.Colors.Blue),
                                ],
                                flags: discord_js_1.MessageFlags.Ephemeral,
                            });
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
                            .setDescription(`**Error:** ${err}`)
                            .setColor(discord_js_1.Colors.DarkRed),
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

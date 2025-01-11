import {
  getBotBadges,
  getBotIntents,
  UserBadges,
  ExtraBadges,
  Emojis,
  BoostBadges,
  Colors,
} from "../../../config";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  inlineCode,
  RESTJSONErrorCodes,
  roleMention,
  time,
  User,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  disabled: true,
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Checkout a users information!")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.UserInstall,
      ApplicationIntegrationType.GuildInstall,
    ])
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("the member to search for")
        .setRequired(true)
    ),
  async execute({ client, interaction }) {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.options.getMember("member");

    if (member instanceof GuildMember) {
      if (member.user.bot) {
        const response = await fetch(
          `https://discord.com/api/v10/applications/${member.id}/rpc`
        );
        const api = await response.json(); // as APIApplication;

        if (api.code === RESTJSONErrorCodes.UnknownApplication) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Unable to access information for that app`)
                .setColor(Colors.Normal),
            ],
          });
        } else {
          const badges = getBotBadges(api);
          const intents = getBotIntents(api);

          const supportsGuildInstallation =
            api.integration_types_config[
              ApplicationIntegrationType.GuildInstall
            ];
          const supportsUserInstallation =
            api.integration_types_config[
              ApplicationIntegrationType.UserInstall
            ];

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`${member.user.displayName}'s Information`)
                .setColor(Colors.Normal)
                .setThumbnail(member.displayAvatarURL())
                .setDescription(api.description)
                .addFields([
                  {
                    name: "App Information:",
                    value: `Verified: ${
                      member.user.flags.has("VerifiedBot")
                        ? UserBadges.VerifiedBot
                        : ExtraBadges.UnverifiedBot
                    }\nBadges: ${badges.join(" ") || "N/A"}\nId: ${inlineCode(
                      api.id
                    )}\nTags: ${api.tags
                      .map((tag: string) => inlineCode(tag))
                      .join(" ")}\nMonetization: ${
                      api.is_monetized ? Emojis.Check : Emojis.Cross
                    }\nPublic: ${api.bot_public ? Emojis.Check : Emojis.Cross}`,
                  },
                  {
                    name: "Installation Methods:",
                    value: `- Guild: ${
                      supportsGuildInstallation ? Emojis.Check : Emojis.Cross
                    }\n- User: ${
                      supportsUserInstallation ? Emojis.Check : Emojis.Cross
                    }`,
                    inline: false,
                  },
                  {
                    name: "App Intents:",
                    value: intents || "N/A",
                    inline: false,
                  },
                ]),
            ],
          });
        }
      } else {
        const streamingActivity = member.presence?.activities
          .filter((a) => a.name === "YouTube" || a.name === "Twitch")
          .find((a) => a.type === ActivityType.Streaming);

        const platform = streamingActivity
          ? streamingActivity.name === "YouTube"
            ? Emojis.YouTube
            : streamingActivity.name === "Twitch"
            ? Emojis.Twitch
            : ""
          : Emojis.Cross;

        const deviceStatusIcons = {
          desktop: {
            online: Emojis.DesktopOnline,
            idle: Emojis.DesktopIdle,
            dnd: Emojis.DesktopDnd,
          },
          mobile: {
            online: Emojis.MobileOnline,
            idle: Emojis.MobileIdle,
            dnd: Emojis.MobileDnd,
          },
          web: {
            online: Emojis.WebOnline,
            idle: Emojis.WebIdle,
            dnd: Emojis.WebDnd,
          },
        };

        const device = Object.keys(deviceStatusIcons).find((device) =>
          member.presence?.clientStatus?.hasOwnProperty(device)
        );

        const statusEmoji: string =
          device && member.presence?.clientStatus
            ? deviceStatusIcons[device][member.presence.status]
            : Emojis.Invisible;

        const badges = member.user.flags.toArray() ?? [];
        const badgeEmojis: string[] = [...badges]
          .filter((Badge) => UserBadges[Badge])
          .map((Badge) => UserBadges[Badge]);

        if (member.user.discriminator === "0")
          badgeEmojis.push(ExtraBadges.OrginallyKnownAs);
        if (
          member.user.displayAvatarURL().endsWith(".gif") ||
          member.premiumSince
        )
          badgeEmojis.push(UserBadges.Nitro);
        if (member.premiumSinceTimestamp) {
          const boostStartDate = new Date(member.premiumSinceTimestamp);
          const currentDate = new Date();

          const monthsDiff =
            (currentDate.getFullYear() - boostStartDate.getFullYear()) * 12 +
            (currentDate.getMonth() - boostStartDate.getMonth());

          if (monthsDiff >= 1) {
            const boostStageEmojis = {
              1: BoostBadges.Month1,
              2: BoostBadges.Month2,
              3: BoostBadges.Month3,
              6: BoostBadges.Month6,
              9: BoostBadges.Month9,
              12: BoostBadges.Month12,
              15: BoostBadges.Month15,
              18: BoostBadges.Month18,
              24: BoostBadges.Month24,
            };

            const boostStageEmoji: string = boostStageEmojis[monthsDiff];
            if (boostStageEmoji) {
              badgeEmojis.push(boostStageEmoji);
            }
          } else {
            badgeEmojis.push(BoostBadges.Month1);
          }
        }

        const maxPermissions = Object.keys(PermissionFlagsBits).length;
        const userPermissions = member.permissions.toArray().length;
        const percent = Math.round((userPermissions / maxPermissions) * 100);

        const maxRolesToShow = 8;

        const roles = member.roles.cache.filter(
          (role) => role.id !== interaction.guildId
        );
        const roleNames = roles.map((role) => `<@&${role.id}>`);

        let formattedRoles = roleNames
          .slice(0, maxRolesToShow)
          .reduce((acc, roleName, index) => {
            const lineBreak = index % 2 === 1 ? "\n" : " ";
            return (
              acc + roleName + (index < maxRolesToShow - 1 ? lineBreak : " ")
            );
          }, "");

        if (roleNames.length > maxRolesToShow) {
          const remainingRolesCount = roleNames.length - maxRolesToShow;
          formattedRoles += inlineCode(`+${remainingRolesCount}`);
        }

        const formatInlineCode = (text: string): string => {
          const lowerCaseText = text.toLowerCase();
          const paddedText = lowerCaseText.padEnd(9, " ");
          return inlineCode(paddedText);
        };

        const mainPage = new EmbedBuilder()
          // .setDescription(``)
          .setColor(Colors.Normal)
          .setThumbnail(member.displayAvatarURL())
          .setFields([
            {
              name: "member information:",
              value: `
${formatInlineCode("device")} ${statusEmoji}
${formatInlineCode("badges")} ${badgeEmojis.join(" ")}
${formatInlineCode("userID")} ${inlineCode(member.id)}
${formatInlineCode("banner")} ${
                (await member.fetch(true)).user.banner
                  ? `[link ↗︎](${(await member.fetch(true)).user.bannerURL({
                      extension: "png",
                    })})`
                  : Emojis.Cross
              }
${formatInlineCode("avatar")} ${
                member.user.avatar
                  ? `[link ↗︎](${member.user.avatarURL({ extension: "png" })})`
                  : Emojis.Cross
              }
${formatInlineCode("created")} ${time(
                Math.round(member.user.createdTimestamp / 1000),
                "D"
              )}
              `,
              inline: false,
            },
            {
              name: "server information:",
              value: `
${formatInlineCode("owner")} ${
                member.id === interaction.guild.ownerId
                  ? Emojis.Check
                  : Emojis.Cross
              }
${formatInlineCode("rank")} ${roleMention(member.roles.highest.id)}
${formatInlineCode("color")} ${inlineCode(member.displayHexColor || "#000000")}
${formatInlineCode("nickname")} ${
                member.nickname !== null
                  ? inlineCode(member.nickname)
                  : Emojis.Cross
              }
${formatInlineCode("call")} ${
                member.voice.channel
                  ? `[↗︎](${member.voice.channel.url})`
                  : Emojis.Cross
              }
${formatInlineCode("timedOut")} ${
                member.isCommunicationDisabled() ? Emojis.Check : Emojis.Cross
              }
${formatInlineCode("streaming")} ${platform}
${formatInlineCode("boosting")} ${
                member.premiumSince !== null ? Emojis.Check : Emojis.Cross
              }
${formatInlineCode("joined")} ${time(
                Math.round(member.guild.joinedTimestamp / 1000),
                "D"
              )}
${formatInlineCode("perms")} ${inlineCode(
                `${userPermissions}/${maxPermissions}`
              )} ${inlineCode(`${percent}%`)}
              `,
              inline: false,
            },
            {
              name: "ʀᴏʟᴇs:",
              value: `
                  ${formattedRoles}
                  `,
              inline: false,
            },
          ])
          .setFooter({ text: `GuildMember` })
          .setTimestamp();

        const customActivities = [
          {
            activityName: "Spotify",
            detailsLabel: "sᴏɴɢ",
            stateLabel: "ᴀʀᴛɪsᴛ",
          },
          {
            activityName: "Visual Studio Code",
            detailsLabel: "ғɪʟᴇ",
            stateLabel: "ᴘʀᴏᴊᴇᴄᴛ",
          },
          {},
        ];

        const activitiesPage = new EmbedBuilder()
          .setDescription("**ᴄᴜʀʀᴇɴᴛ ᴀᴄᴛɪᴠɪᴛɪᴇs**")
          .setColor(Colors.Normal);

        const activities = member.presence?.activities || [];

        const filtered = activities.filter(
          (activity) => activity.name !== "Custom Status"
        );

        if (filtered.length === 0) {
          await interaction.editReply({ embeds: [mainPage] }); // here is a reply
        } else {
          filtered.forEach((activity) => {
            let detailsText = `ᴅᴇᴛᴀɪʟs: ${activity.details ?? "ɴ/ᴀ"}`;
            let stateText = `sᴛᴀᴛᴇ: ${activity.state ?? "ɴ/ᴀ"}`;
            let displayName = activity.name ?? "ɴ/ᴀ";

            const showCustomActivites = true;

            if (showCustomActivites) {
              const customActivity = customActivities.find(
                (custom) => custom.activityName === activity.name
              );

              if (customActivity) {
                detailsText = `${customActivity.detailsLabel}: ${activity.details}`;
                stateText = `${customActivity.stateLabel}: ${activity.state}`;
                displayName = customActivity.activityName;

                activitiesPage.addFields({
                  name: displayName,
                  value: `
    ${detailsText}
    ${stateText}
                    `,
                });
              } else {
                activitiesPage.addFields({
                  name: displayName,
                  value: `
    ᴅᴇᴛᴀɪʟs: ${activity.details ?? "ɴ/ᴀ"}
    sᴛᴀᴛᴇ: ${activity.state ?? "ɴ/ᴀ"}
                      `,
                });
              }
            } else {
              activitiesPage.addFields({
                name: displayName,
                value: `
    ${activity.details}
    ${activity.state}
                  `,
              });
            }
          });

          const pages = [mainPage, activitiesPage];
          let currentPageIndex = 0;

          await interaction.editReply({
            // take this away if other option works only this part: const buttonsmsg =
            embeds: [pages[currentPageIndex]],
          });

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("previousPage")
              .setLabel("Back")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("nextPage")
              .setLabel("Next")
              .setStyle(ButtonStyle.Secondary)
          );

          const msg = await interaction.editReply({
            embeds: [pages[currentPageIndex]],
            components: [row],
          });

          const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 180000, // 3 min
          });

          collector.on("collect", async (button) => {
            const buttonId = button.customId;

            if (buttonId === "previousPage" && currentPageIndex > 0) {
              currentPageIndex--;
            } else if (
              buttonId === "nextPage" &&
              currentPageIndex < pages.length - 1
            ) {
              currentPageIndex++;
            }

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("previousPage")
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId("nextPage")
                .setLabel("Next")
                .setStyle(ButtonStyle.Secondary)
            );

            const isFirstPage = currentPageIndex === 0;
            const isLastPage = currentPageIndex === pages.length - 1;

            const buttons = [...row.components];

            if (isFirstPage) {
              buttons[0].setDisabled(true);
            }

            if (isLastPage) {
              buttons[1].setDisabled(true);
            }

            await button.update({
              embeds: [pages[currentPageIndex]],
              components: [row],
            });
          });

          collector.on("end", async (c, reason) => {
            if (reason === "time") {
              await interaction.editReply({ components: [] });
            }
          });
        }
      }
    } else {
      const user = interaction.options.getUser("member");

      if (user instanceof User) {
        await interaction.editReply({
          content: `\`\`\`json\n${JSON.stringify(user, null, 2)}\n\`\`\``,
        });
      }
    }
  },
} as SlashCommandModule;

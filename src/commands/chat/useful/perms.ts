import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionResolvable,
  resolveColor,
  userMention,
} from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler/types/Command";
import { Colors, Emojis } from "../../../config";

export = {
  name: "perms",
  aliases: ["p"],
  category: 'useful',
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const user = message.mentions.users.first();

    if (!user) {
      await message.reply({ content: "Please provide a valid member in this server" });
      return;
    }

    const member = message.guild.members.cache.get(user.id);
  

    if (!member) {
      await message.reply({ content: "The mentioned user is not in this server" });
      return;
    }

    const perms = Object.entries(member.permissions.serialize()).map(
      ([permission]) => {
        const state = member.permissions.has(permission as PermissionResolvable)
          ? Emojis.Check
          : Emojis.Cross;

        return { permission, state };
      }
    );

// -----------------------------------------------------------------------------
    const embeds = [];
    const amount = 12;
    let chunkIndex = 0;
    while (chunkIndex < perms.length) {
      const chunk = perms.slice(chunkIndex, chunkIndex + amount);
      const description = chunk
        .map(({ state, permission }) => {
          return `${state} \` ${permission.padEnd(33, " ")}\``;
        })
        .join("\n");

      const embed = {
        color: resolveColor(Colors.Normal),
        description: description,
        footer: {
          text: `Page ${embeds.length + 1}/${Math.ceil(perms.length / amount)}`,
        },
      };
      embeds.push(embed);
      chunkIndex += amount;
    }

    let currentPage = 0;

    const backButton = new ButtonBuilder()
      .setCustomId("perms-back")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Back");

    const nextButton = new ButtonBuilder()
      .setCustomId("perms-next")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Next");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      backButton,
      nextButton
    );

    const reply = await message.reply({
      embeds: [embeds[currentPage]],
      components: [row],
      allowedMentions: {
        repliedUser: false
      }
    });

    client.replies.set(message.id, reply.id);

    if (embeds.length > 1) {
      const collector = reply.createMessageComponentCollector({
        filter: ({ user }) => message.author.id === user.id,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "perms-back") {
          if (currentPage > 0) {
            currentPage--;
          }
        } else if (interaction.customId === "perms-next") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
          }
        }

        await interaction.update({
          embeds: [embeds[currentPage]],
          components: [row],
        });
      });

      collector.on("ignore", async (button) => {
        await button.reply({
          content: `This menu is for ${userMention(message.member.id)} not you.`,
          ephemeral: true,
        });
     });
    }
  },
} as PrefixCommandModule;

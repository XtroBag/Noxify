import { ChannelType, EmbedBuilder } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler/types/Command";
import { Colors } from "../../../config";

export = {
  name: "guilds",
  aliases: ["g"],
  category: "useful",
  ownerOnly: true,
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const guilds = client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .first(10);

    const description = guilds
      .map((guild, index) => {
        return `\`\`${index + 1}\`\` **${guild.name}** - ${
          guild.memberCount
        } members`;
      })
      .join("\n");

    const reply = await message.reply({
      embeds: [
        new EmbedBuilder().setDescription(description).setColor(Colors.Normal),
      ],
    });

    client.replies.set(message.id, reply.id);
  },
} as PrefixCommandModule;

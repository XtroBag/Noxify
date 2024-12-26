import { ChannelType, EmbedBuilder } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler";
import { Colors } from "../../../config";

export = {
  name: "guilds",
  aliases: ["g"],
  category: "useful",
  ownerOnly: true,
  type: CommandTypes.PrefixCommand,
  async execute(client, message, args, db): Promise<void> {
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

    await message.reply({
      embeds: [
        new EmbedBuilder().setDescription(description).setColor(Colors.Normal),
      ],
    });
  },
} as PrefixCommandModule;

import { inlineCode } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../handler/types/Command";
import { Server } from '../../../handler/schemas/models/Models';

export = {
  name: "prefix",
  aliases: ["pfix", "p"],
  category: "general",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const prefix = args.join(" ");

    if (!prefix) return await message.reply({ content: `Please provide a prefix to set.` });

    if (prefix.length > 7) {
      return await message.reply({ content: `Prefix needs to be shorter than 7 characters long.` });
    }

    if (prefix.includes("/")) {
      return await message.reply({ content: `The "/" character cannot be used as a prefix as it interferes with slash commands.` });
    }

    const server = await Server.findOne({ guildID: message.guildId });

    server.prefix = prefix;

    await server.save();

    await message.reply({ content: `Prefix is now set to ${inlineCode(prefix)}` });
  },
} as PrefixCommandModule;

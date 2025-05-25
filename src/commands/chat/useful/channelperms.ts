import { ChannelType } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../../System/Types/Command.js";

export default {
  name: "channelperms",
  aliases: ["cp"],
  category: "useful",
  ownerOnly: true,
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const channel = message.mentions.channels.first();

    if (channel?.type === ChannelType.GuildText) {
      const channelPermissions = channel.permissionsFor(
        message.guild.roles.everyone
      );

      if (channelPermissions) {
        const perms = Object.entries(channelPermissions.serialize()).map(
          ([permission, state]) => {
            const emojiState = state ? "✅" : "❌";
            return { permission, state: emojiState };
          }
        );

        console.log(perms);
      } else {
        console.log("Permissions could not be retrieved.");
      }
    } else {
      console.log("Please mention a valid text channel.");
    }
  },
} as PrefixCommandModule;

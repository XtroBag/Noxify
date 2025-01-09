import { CommandTypes, PrefixCommandModule } from "../../../handler";
import { ChannelType, Message } from "discord.js";

export = {
  name: "say",
  aliases: ["s"],
  category: "fun",
  
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {

    const messageToSay = args.join(" ");

    if (!messageToSay) {
      await message.reply({
        content: "Please provide a message for me to say. Add what you want me to say after the command and I'll say it."
      });
      return;
    }

    // Check if the message contains @here or @everyone
    if (messageToSay.includes("@everyone") || messageToSay.includes("@here")) {
      try { 
        await message.reply({
          content: "I cannot send messages that mention `@everyone` or `@here` because that would ping everyone on the server."
        });
      } catch (error) {
        console.error("Error trying to delete the message or send a reply:", error);
      }
      return;
    }

    try {
      // Delete the user's command message
      await message.delete()

      // Check if the channel is a text channel and send the message
      if (message.channel.type === ChannelType.GuildText) {
        await message.channel.send({ content: messageToSay, flags: ['SuppressNotifications'], allowedMentions: { repliedUser: false } });
      }
    } catch (error) {
      console.error("Error executing 'say' command:", error);
      await message.reply({
        content: "There was an error trying to execute that command.",
      });
    }
  },
} as PrefixCommandModule;

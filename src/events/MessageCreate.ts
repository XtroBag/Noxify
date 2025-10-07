import { Events } from "discord.js";
import Event from "../types/Event";

export default new Event(
  Events.MessageCreate,
  { once: false, enabled: true },
  async (noxify, message) => {
    if (message.inGuild()) {
      if (message.channel.isTextBased() && !message.author.bot) {
        console.log(
          `Message from ${message.author.tag} in #${message.channel.name}: ${message.content}`
        );
      }
      if (message.content.startsWith('!ping')) {
        await message.reply('Pong!');
      }
    }
  }
);
